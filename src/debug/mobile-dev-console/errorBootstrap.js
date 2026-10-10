
// ================================================== // EMERGENCY ERROR BOOTSTRAP // ==================================================
(() => {
// Prevent accidental duplicate installation.
if (window.__errorBootstrapInstalled) {
    return;
}

window.__errorBootstrapInstalled = true;

// --------------------------------------------------
// DISPLAY FATAL ERROR
// --------------------------------------------------

window.showFatalError = function(title, error) {

    const panel =
        document.getElementById('productionErrorLog');

    if (!panel) {
        return;
    }

    let message;

    if (error instanceof Error) {
        message = error.stack || error.message;
    } else if (
        error &&
        typeof error === 'object'
    ) {
        try {
            message = JSON.stringify(error, null, 2);
        } catch {
            message = String(error);
        }
    } else {
        message = String(error ?? 'Unknown error');
    }

    // Build the panel using DOM methods only.
    // This does not depend on console.js or console.css.

    panel.replaceChildren();

    Object.assign(panel.style, {
        display: 'block',
        position: 'fixed',
        top: '10px',
        left: '10px',
        right: '10px',
        maxHeight: '70vh',
        overflow: 'auto',
        padding: '12px',
        background: '#300',
        color: '#fff',
        border: '2px solid #f55',
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '13px',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        zIndex: '2147483647',
        boxSizing: 'border-box'
    });

    const heading =
        document.createElement('strong');

    heading.textContent =
        `⚠ ${title}`;

    const details =
        document.createElement('pre');

    Object.assign(details.style, {
        margin: '10px 0 0',
        color: '#ffaaaa',
        font: 'inherit',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere'
    });

    details.textContent = message;

    panel.append(heading, details);
};

// --------------------------------------------------
// RUNTIME AND RESOURCE ERRORS
// --------------------------------------------------

window.addEventListener('error', event => {

    let title = 'JavaScript Runtime Error';
    let error;

    // Resource-loading errors usually have no event.error.
    if (!event.error) {

        title = 'JavaScript / Module / Resource Load Error';

        error = {
            message:
                event.message ||
                'A script, module, or other resource failed to load.',

            filename:
                event.filename || null,

            line:
                event.lineno || null,

            column:
                event.colno || null,

            target:
                event.target?.src ||
                event.target?.href ||
                event.target?.tagName ||
                null
        };

    } else {

        error = {
            message: event.message,

            filename:
                event.filename || null,

            line:
                event.lineno || null,

            column:
                event.colno || null,

            stack:
                event.error?.stack || null
        };

    }

    if (window.devConsole) {
        window.devConsole.error(error);
    }

    window.showFatalError(title, error);

}, true);

// --------------------------------------------------
// UNHANDLED PROMISE ERRORS
// --------------------------------------------------

window.addEventListener('unhandledrejection', event => {

    if (window.devConsole) {
        window.devConsole.error(event.reason);
    } else {
        window.showFatalError(
            'Unhandled Promise Error',
            event.reason
        );
    }

});

// --------------------------------------------------
// UNHANDLED PROMISE ERRORS
// --------------------------------------------------

window.addEventListener(
    'unhandledrejection',
    event => {

        window.showFatalError(
            'Unhandled Promise Error',
            event.reason
        );

    }
);
})();