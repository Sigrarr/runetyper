/* global App */

App.SelectsController = {

    active: {
        top: null,
        sub: null
    },
    subActivation: false,

    handle: function (select) {
        if (select.classList.contains("sub-select")) {
            this.handleSub(select);
        } else {
            this.handleTop(select);
        }
    },

    handleTop: function (select) {
        this.clearSub();
        this.subActivation = false;

        if (select === this.active.top) {
            this.clearTop();
        } else {
            this.setActive(select, "top");
        }
    },

    handleSub: function (select) {
        if (select === this.active.sub) {
            this.clearSub();
            if (this.subActivation) {
                this.clearTop();
            }
            return;
        }

        if (!this.active.top) {
            this.setActive(this.findContainingSelect(select.parentNode, false), "top");
            this.subActivation = true;
        }

        this.setActive(select, "sub");
    },

    setActive: function (select, key) {
        var lockWalk = true;

        if (this.active[key]) {
            this.deactivate(this.active[key], false);
            this.active[key].classList.add("lock");
            lockWalk = false;
        }

        this.activate(select, lockWalk);
        this.active[key] = select;
    },

    clear: function () {
        this.clearSub();
        this.clearTop();
        this.subActivation = false;
    },

    clearTop: function () {
        if (this.active.top) {
            this.deactivate(this.active.top, true);
            this.active.top = null;
            this.subActivation = false;
        }
    },

    clearSub: function () {
        if (this.active.sub) {
            this.deactivate(this.active.sub, true);
            this.active.sub = null;
        }
    },

    activate: function (select, lockSiblings) {
        if (lockSiblings) {
            this.setSiblingsLock(select, "add");
        }
        select.classList.remove("lock");
        select.classList.add("active");
    },

    deactivate: function (select, unlockSiblings) {
        if (unlockSiblings) {
            this.setSiblingsLock(select, "remove");
        }
        select.classList.remove("active");
    },

    setSiblingsLock: function (startElement, lockActionMethod) {
        var element = startElement;
        while ((element = (element.nextElementSibling || element.parentNode.firstElementChild))
                !== startElement) {
            if (element.classList.contains("select")) {
                element.classList[lockActionMethod]("lock");
            }
        }
    },

    findContainingSelect: function (startElement, breakAtActionButton) {
        for (
                var i = 0, element = startElement, select = null;
                i < 5 && !select && element && element.classList;
                i++, element = element.parentNode
        ) {
            if (element.classList.contains("select") && !element.classList.contains("disabled")) {
                select = element;
            } else if (breakAtActionButton && element.hasAttribute("data-topic")) {
                break;
            }
        }

        return select;
    }

};
