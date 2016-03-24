'use strict';
define(['app/store'], function(store) {
    var modifiers = {};
    var codes = {
        left:  37,
        right: 39,
        up: 38,
        down: 40,
        cmd: 91,
        ctrl: 17
    };

    function onKeyup(event) {
        if(event.keyCode === codes.ctrl) {
            return modifiers.ctrl = false;
        }
        if(event.keyCode === codes.cmd) {
            return modifiers.cmd = false;
        }
    }

    function onKeydown(event) {
        switch (event.keyCode) {
            case codes.ctrl:
                modifiers.ctrl = true;
                break;
            case codes.cmd:
                modifiers.cmd = true;
                break;
            case codes.up:
                if(modifiers.ctrl || modifiers.cmd) {
                    event.preventDefault();
                    previousSpec();
                }
                break;
            case codes.down:
                if(modifiers.ctrl || modifiers.cmd) {
                    event.preventDefault();
                    nextSpec();
                }
                break;
            case codes.left:
                event.preventDefault();
                if(modifiers.ctrl || modifiers.cmd) {
                    previousViewport();
                } else {
                    previousEnvironment();
                }
                break;
            case codes.right:
                event.preventDefault();
                if(modifiers.ctrl || modifiers.cmd) {
                    nextViewport();
                } else {
                    nextEnvironment();
                }
                break;
            default: break;
        }
    }

    function getNewViewportIdx(viewportNames, idx, step) {
        var newIdx = (idx + step) % viewportNames.length;
        if (newIdx < 0) {
            newIdx += viewportNames.length;
        }
        var model = store.getCurrentSpec();
        if(!model || model.hasViewport(viewportNames[newIdx])) {
            return newIdx;
        } else {
            return getNewViewportIdx(viewportNames, newIdx, step);
        }
    }

    function previousSpec() {
        var specs = store.getSpecs();
        var slug = store.getCurrentSpec().get('slug');
        var idx = specs.findIndex(function(spec) {
            return spec.get('slug') === slug;
        });
        idx = (idx === 0) ? idx = specs.length - 1 : idx - 1;
        window.location.hash = '!/spec/' + specs[idx].get('slug');
    }
    function nextSpec() {
        var specs = store.getSpecs();
        var slug = store.getCurrentSpec().get('slug');
        var idx = specs.findIndex(function(spec) {
            return spec.get('slug') === slug;
        });
        idx = (idx + 1) % specs.length;
        window.location.hash = '!/spec/' + specs[idx].get('slug');
    }
    function previousEnvironment() {
        var environments = _.keys(store.getEnvironments());
        var idx = (environments.indexOf(store.getCurrentEnvironment()) - 1);
        idx = idx < 0 ? environments.length - 1 : idx;
        store.setCurrentEnvironment(environments[idx]);

    }
    function nextEnvironment() {
        var environments = _.keys(store.getEnvironments());
        var idx = (environments.indexOf(store.getCurrentEnvironment()) + 1) % environments.length;
        store.setCurrentEnvironment(environments[idx]);
    }
    function previousViewport() {
        var viewportNames = _.keys(store.getViewports());
        var idx = getNewViewportIdx(viewportNames, viewportNames.indexOf(store.getCurrentViewport()), -1);
        store.setCurrentViewport(viewportNames[idx]);
    }
    function nextViewport() {
        var viewportNames = _.keys(store.getViewports());
        var idx = getNewViewportIdx(viewportNames, viewportNames.indexOf(store.getCurrentViewport()), 1);
        store.setCurrentViewport(viewportNames[idx]);
    }

    var KeyboardInterface = {
        initialize: function() {
            $(document).off('.$$keyboard');
            $(document).on('keyup.$$keyboard', onKeyup);
            $(document).on('keydown.$$keyboard', onKeydown);
        }
    };
    _.extend(KeyboardInterface, Backbone.Events);
    return KeyboardInterface;
});
