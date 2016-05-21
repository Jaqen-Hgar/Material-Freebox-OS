/**
 * Material-Freebox-OS
 * Main script - injected by injector.js
 */
(function() {
    // Could be undefined on login page
    if (typeof Ext !== 'undefined') {
        // Override windows buttons size
        // We need to override this ASAP
        Ext.panel.Tool.prototype.width = 35;
        Ext.panel.Tool.prototype.height = 35;
    }


    /**
     * This function is called once the desktop is fully loaded
     */
    var desktopLoaded = function() {
        // We're on login page, no need to go further
        if (window.FbxConf === undefined)
            return;

        var ui = {
            toolbar: $('.freeboxos-southbar.x-toolbar')
        };

        // DESKTOP
        // Write Freebox OS version next to the huge title
        $('<div />')
            .addClass('fbxos-version-text')
            .text('v' + FbxConf.firmwareVersionMajor + '.' + FbxConf.firmwareVersionMinor)
            .appendTo($('.fbxos-version'));


        // Listen for window size change events
        var syncMonitorWindowResize = Ext.window.Window.prototype.syncMonitorWindowResize;
        Ext.window.Window.prototype.syncMonitorWindowResize = function() {
            var result = syncMonitorWindowResize.apply(this, arguments);

            // If any of the visible windows is fullscreen
            ui.toolbar.toggleClass('solid-background', $('.x-window-maximized:not(.x-hide-offsets)').length > 0);

            return result;
        };


        // Listen for window focus change
        var sortByZIndex = function(a, b) {
            var aZindex = $(a).css('z-index');
            var bZindex = $(b).css('z-index');

            return ((aZindex < bZindex) ? -1 : ((aZindex > bZindex) ? 1 : 0));
        };

        var bringToFront = Ext.ZIndexManager.prototype.bringToFront;
        Ext.ZIndexManager.prototype.bringToFront = function() {
            var result = bringToFront.apply(this, arguments);
            var windows = $('.x-window:not(.x-hide-offsets)').slice();

            // Set blurred class on all windows
            windows.toggleClass('x-window-focus-blurred', true);

            // Find focused window
            windows.sort(sortByZIndex);

            // Set focuses class on active window
            $(windows[windows.length-1])
                .toggleClass('x-window-focus-focused', true)
                .toggleClass('x-window-focus-blurred', false);

            return result;
        };
    };

    function waitFor(something, onceReady) {
        var i = setInterval(function() {
            if (something()) {
                clearInterval(i);
                onceReady();
            }
        }, 200);
    }

    // Wait for jQuery & desktop to be loaded
    waitFor(function() {
        return !!window.jQuery && !!$('.fbxos-version').length;
    }, desktopLoaded);
})();
