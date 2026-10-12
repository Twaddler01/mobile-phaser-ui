export default class DOMOverlay {
    constructor(scene, options = {}) {
        this.scene = scene;

        this.dismissOnOutsideClick =
            options.dismissOnOutsideClick ?? true;

        this.onClose = options.onClose ?? null;

        this.visible = false;
        this.destroyed = false;
        this.content = null;

        // Fixed to the viewport; adds no document layout space.
        this.element = document.createElement("div");

        Object.assign(this.element.style, {
            position: "fixed",
            inset: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            background: "transparent",
            zIndex: String(options.zIndex ?? 2000),
            pointerEvents: "auto",
            touchAction: "none",
            display: "none"
        });

        this.contentHost = document.createElement("div");

        Object.assign(this.contentHost.style, {
            position: "absolute",
            left: "0",
            top: "0",
            width: "max-content",
            maxWidth: "calc(100vw - 16px)",
            maxHeight: "calc(100dvh - 16px)",
            overflow: "auto",
            boxSizing: "border-box",
            pointerEvents: "auto",
            touchAction: "auto"
        });

        this.element.appendChild(this.contentHost);
        document.body.appendChild(this.element);

        // Taps outside the content dismiss the overlay.
        this.handleOutsidePointerDown = event => {
            if (event.target !== this.element) return;

            event.preventDefault();
            event.stopPropagation();

            if (this.dismissOnOutsideClick) {
                this.hide();
            }
        };

        // Prevent interactions within the overlay from bubbling
        // to document-level handlers.
        this.handleContentPointerDown = event => {
            event.stopPropagation();
        };

        this.element.addEventListener(
            "pointerdown",
            this.handleOutsidePointerDown
        );

        this.contentHost.addEventListener(
            "pointerdown",
            this.handleContentPointerDown
        );

        this.handleResize = () => {
            if (this.visible) {
                this.positionContent();
            }
        };

        window.addEventListener("resize", this.handleResize);
        window.visualViewport?.addEventListener(
            "resize",
            this.handleResize
        );

        this.scene.events.once("shutdown", this.destroy, this);
        this.scene.events.once("destroy", this.destroy, this);
    }

    show(options = {}) {
        if (this.destroyed) return this;

        if (options.content) {
            this.setContent(options.content);
        }

        this.x = options.x ?? 0;
        this.y = options.y ?? 0;

        this.element.style.display = "block";
        this.visible = true;

        this.positionContent();

        return this;
    }

    setContent(content) {
        if (!content) {
            throw new TypeError(
                "DOMOverlay requires a content element."
            );
        }

        this.content = content;
        this.contentHost.replaceChildren(content);

        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;

        if (this.visible) {
            this.positionContent();
        }

        return this;
    }

    positionContent() {
        if (!this.content || !this.visible) return;

        const host = this.contentHost;

        // Measure at the requested position before clamping.
        host.style.left = `${this.x}px`;
        host.style.top = `${this.y}px`;

        const rect = host.getBoundingClientRect();
        const viewport = window.visualViewport;

        const viewportWidth =
            viewport?.width ?? document.documentElement.clientWidth;

        const viewportHeight =
            viewport?.height ?? document.documentElement.clientHeight;

        const left = Math.max(
            8,
            Math.min(this.x, viewportWidth - rect.width - 8)
        );

        const top = Math.max(
            8,
            Math.min(this.y, viewportHeight - rect.height - 8)
        );

        host.style.left = `${left}px`;
        host.style.top = `${top}px`;
    }

    hide() {
        if (!this.visible) return this;

        this.visible = false;
        this.element.style.display = "none";

        this.onClose?.();

        return this;
    }

    destroy() {
        if (this.destroyed) return;

        this.destroyed = true;
        this.visible = false;

        this.element.removeEventListener(
            "pointerdown",
            this.handleOutsidePointerDown
        );

        this.contentHost.removeEventListener(
            "pointerdown",
            this.handleContentPointerDown
        );

        window.removeEventListener("resize", this.handleResize);
        window.visualViewport?.removeEventListener(
            "resize",
            this.handleResize
        );

        this.scene.events.off("shutdown", this.destroy, this);
        this.scene.events.off("destroy", this.destroy, this);

        this.element.remove();

        this.content = null;
        this.onClose = null;
    }
}