
// ==================================================
// PRODUCTION ERROR CATCHER
// ==================================================

window.addEventListener('error', event => {
    showFatalError(
        'JavaScript Error',
        event.error?.stack ||
        `${event.message}\n${event.filename}:${event.lineno}:${event.colno}`
    );
});

window.addEventListener('unhandledrejection', event => {
    const error = event.reason;

    showFatalError(
        'Unhandled Promise Error',
        error?.stack || error?.message || String(error)
    );
});

function showFatalError(title, message) {

    const consoleLog = document.getElementById('productionErrorLog');

    if (!consoleLog) return;

    consoleLog.innerHTML = `
        <div style="
            background:#300;
            color:#fff;
            padding:12px;
            font-family:monospace;
            white-space:pre-wrap;
            overflow:auto;
        ">
            <strong>⚠ ${escapeHTML(title)}</strong>

            <div style="
                margin-top:10px;
                color:#ffaaaa;
            ">${escapeHTML(message)}</div>
        </div>
    `;
}

function escapeHTML(value) {
    const div = document.createElement('div');
    div.textContent = String(value);
    return div.innerHTML;
}

import { DEBUG } from '../../config.js';

function startConsole() { // CONSOLE START

document.getElementById('consoleLog').innerHTML = `
    <div class="console-header">

        <span class="console-title">Console</span>

        <button id="productionErrorLogClear">
            Clear Error
        </button>

        <button id="consoleClear">
            Clear
        </button>

        <button id="consoleRefresh">
            Reload
        </button>

        <button id="consoleToggle">
            Hide
        </button>

    </div>

    <div class="console-body">
        <div id="js-console"></div>
    </div>

    <style>
        #js-console,
        #js-console * {
            box-sizing: border-box;
        }

        #js-console > div {
            background-color: #333;
            color: white;
            font-family: monospace;
            padding: 2px 2px;
            margin-top: -1px;
        }

        #js-console .log {
            white-space: pre-wrap;
            overflow-x: auto;
        }

        #js-console .warn {
            background: yellow;
            color: black;
        }

        #js-console .error {
            background: red;
        }

        #js-console .prefix {
            display: inline-block;
            min-width: 8em;
            margin-right: 2em;
            opacity: 0.8;
        }
    </style>
`;

const consoleLog = document.getElementById('consoleLog');
const consoleToggle = document.getElementById('consoleToggle');
const consoleRefresh = document.getElementById('consoleRefresh');
const consoleClear = document.getElementById('consoleClear');
const productionErrorLogClear = document.getElementById('productionErrorLogClear');

productionErrorLogClear.onclick = () => {
    document.getElementById('productionErrorLog').innerHTML = '';
};

consoleClear.onclick = () => {
    document.getElementById('js-console').innerHTML = '';
};

consoleToggle.onclick = () => {

    const collapsed = consoleLog.classList.toggle('collapsed');

    consoleToggle.textContent = collapsed
        ? 'Show'
        : 'Hide';
};

consoleRefresh.onclick = () => {
    location.reload();
};

// ------------------------------------------
// DRAG CONSOLE
// ------------------------------------------

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

console.header = document.querySelector('.console-header');

console.header.addEventListener('pointerdown', (event) => {

    // Don't start dragging when clicking a header button
    if (event.target.closest('button')) {
        return;
    }

    isDragging = true;

    const rect = consoleLog.getBoundingClientRect();

    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;

    event.preventDefault();
    event.stopPropagation();
});

document.addEventListener('pointermove', (event) => {

    if (!isDragging) {
        return;
    }

    const x = event.clientX - dragOffsetX;
    const y = event.clientY - dragOffsetY;

    consoleLog.style.left = `${x}px`;
    consoleLog.style.top = `${y}px`;
    consoleLog.style.right = 'auto';
    consoleLog.style.bottom = 'auto';

    event.preventDefault();
});

document.addEventListener('pointerup', (event) => {

    if (!isDragging) {
        return;
    }

    isDragging = false;

    event.preventDefault();
});

document.addEventListener('pointercancel', () => {
    isDragging = false;
});

// Console activity

let consoleDiv = document.getElementById('js-console');

// If the browser doesn't already have a console object, create an empty one
console = console || {};

// We'll keep an array of past commands, which can be recalled using
// up and down arrows
console.commandHistory = [];
console.commandHistory.cursor = null;
console.commandHistory.getPrev = function() {
	if (this.cursor === null)
		this.cursor = this.length;
	this.cursor = this.cursor-1;
	return this[this.cursor];
}
console.commandHistory.getNext = function() {
	this.cursor++;
	if (this.cursor >= this.length) {
		this.cursor = this.length;
		return '';
	}	
	return this[this.cursor];
}
console.commandHistory.pushAndReset = function(command) {
	this.push(command);
	this.cursor = this.length;
}

// After running a command, we scroll down the page
// 100px to keep the result and textbox in view
console.scrollWindow = function() {
	window.scrollBy({top: 200, left: 0, behavior: 'smooth'});
};

console.log = function() {
	console.render('log', arguments);
};

console.warn = function() {
	console.render('warn', arguments);
};

console.error = function() {
	console.render('error', arguments);
};

// Render a new entry to the log
console.render = function(cssClass, items, prefix) {

    const renderedItems = [...items].map(i => {

        if (i === null) {
            return 'null';
        }

        if (i === undefined) {
            return 'undefined';
        }

        // Strings
        if (typeof i === 'string') {
            if (i.length > 5000) {
                return i.substring(0, 5000).htmlEncode() + '...';
            }

            return i.htmlEncode();
        }

        // Functions
        if (typeof i === 'function') {
            return i.toString().htmlEncode();
        }

        // Objects / arrays
        if (typeof i === 'object') {

            try {

                const visibleObject =
                    !Array.isArray(i)
                        ? unhideProperties(i)
                        : i;

                const result =
                    JSON.stringify(
                        visibleObject,
                        null,
                        2
                    );

                return (
                    result === undefined
                        ? String(i).htmlEncode()
                        : result.htmlEncode()
                );

            } catch (e) {

                return (
                    `[Object: ${e.message}]`
                ).htmlEncode();

            }
        }

        // Numbers, booleans, symbols, etc.
        return String(i).htmlEncode();
    });

    // ------------------------------------------
    // TIMESTAMP
    // ------------------------------------------

    const now = new Date();

    const timestamp = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // ------------------------------------------
    // ENTRY HEADER
    // ------------------------------------------

    const logHeader = ''; // `<span class="log-header">${cssClass.toUpperCase()} · ${timestamp}<br></span>`;

    // ------------------------------------------
    // ENTRY
    // ------------------------------------------

    const div = document.createElement('div');
    div.className = cssClass;

    const content = renderedItems.join(' ');

    div.innerHTML =
        logHeader +
        (prefix
            ? `<span class="prefix">${prefix.htmlEncode()}</span>\n`
            : ''
        ) +
        content;

    consoleDiv.prepend(div);
};

/**
 * Called when a user manually runs some code via the text entry box
 * We'll execute that code and print the result
 */
console.runCommand = function(command) {
	
	// Since iOS tends to type in curly quotes
	// we'll strip those first
	command = command
		.replace(/[\u2018\u2019]/g, "'")
		.replace(/[\u201c\u201d]/g, '"');

	// Try assigning the value, if that works
	// (since eval({a:1}) doesn't show the object)
	var result;
	var evalError = false;
	try {
		result = eval('__temp__=' + command);
	} catch {
		// Nope, that produced an error, so instead
		// we'll attempt to just eval() it
		try {
			result = eval(command);
		} catch (e) {
			evalError = true;
			console.render('error', ['Error: ' + e.message], command);
		}
	}
	
	// Render the result to the screen
	// If it was an evalError, it's likely that the console
	// hook already caught the error separately and we don't
	// need to print it here again
	if (!evalError)
		console.render('log', [result], command);
	
	// Remember the command for later recall
	console.commandHistory.pushAndReset(command);
};

console.textBox = document.getElementById('commandBox');

// Cycle through previous commands using up and down arrows
console.onKeyPress = function(event) {
	if (event.code == 'ArrowUp') {
	
		// Remember current command so it's not lost
		if (this.textBox.value && 
			(this.commandHistory.cursor === null ||
			this.commandHistory.cursor === this.commandHistory.length)) {
			this.commandHistory.push(this.textBox.value);
		}

		// Bugfix: prevent the default action, otherwise
		// this causes cursor to be invisibly placed
		// at start of textbox
		event.preventDefault();
		
		this.textBox.value = this.commandHistory.getPrev();
	}
	
	if (event.code == 'ArrowDown') {
		this.textBox.value = this.commandHistory.getNext();
	}
};

// Converts all hidden properties to visible ones
function unhideProperties(obj) {

    if (
        obj === null ||
        typeof obj !== 'object'
    ) {
        return obj;
    }

    const result = {};

    for (const key in obj) {
        try {
            result[key] = obj[key];
        } catch {
            result[key] = '[unreadable]';
        }
    }

    return result;
}

// Catch all syntax and runtime errors and log them to our custom console
window.onerror = function(errorMsg, url, line, col, e, f) {
	console.render('error', [`${errorMsg} in ${url}, line ${line}, col ${col}.`], 'Javascript Error:');
};

function htmlEncode(text) { 
	let d = document.createElement('div'); 
	d.innerText = text; 
	return d.innerHTML;
}

String.prototype.htmlEncode = function() { return htmlEncode(this); };

// Is this still needed? Maybe not
// range(2,4) => [2,3,4]
function range(a,b) { 
	result = []; 
	for (let i=a; i<=b; i++) 
		result.push(i); 
	return result; 
}

} // CONSOLE END

if (DEBUG) {
    startConsole();
}
