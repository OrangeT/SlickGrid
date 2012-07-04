(function ($) {
    /***
    * Custom data-loader based on slick.remotemodel.js.
    * Not part of SlickGrid source code.
    */
    function PageLoader(urlBase) {

        // private
        var PAGESIZE = 50;
        var data = { length: 0 };
        var searchstr = "apple";
        var sortcol = null;
        var sortdir = 1;
        var h_request = null;
        var req = null; // jqXHR object

        // TODO FIND BETTER WAY OF MOVING LAST REQUEST DATA AROUND
        var lastRequestFromPage = null;
        var lastRequestToPage = null;

        // events
        var onDataLoading = new Slick.Event();
        var onDataLoaded = new Slick.Event();
        var onRequestAborted = new Slick.Event();

        function init() {
        }


        function isDataLoaded(from, to) {
            for (var i = from; i <= to; i++) {
                if (data[i] == undefined || data[i] == null) {
                    return false;
                }
            }

            return true;
        }


        function clear() {
            for (var key in data) {
                delete data[key];
            }
            data.length = 0;
        }

        // Ensures the records specified by "from" and "to" (determined by the current ViewPort contents)
        // are loaded.
        function ensureData(from, to) {

            /*console.debug("Entering ensureData(from:" + from + " to:" + to);*/

            if (req) {
                req.abort();

                var pageStart;
                var pageEnd;

                if (lastRequestToPage > lastRequestFromPage) {
                    pageEnd = lastRequestToPage;
                    pageStart = lastRequestFromPage;
                } else {
                    pageEnd = lastRequestFromPage;
                    pageStart = lastRequestFromPage;
                }

                /*console.debug("pageStart [before abort request] = " + pageStart);
                console.debug("pageEnd [before abort request] = " + pageEnd);*/

                for (var i = pageStart; i <= pageEnd; i++)
                    data[i * PAGESIZE] = undefined;

                onRequestAborted.notify(); // For example: hide "loading" indicator if already showing                
            }

            if (from < 0) {
                from = 0;
            }

            var fromPage = Math.floor(from / PAGESIZE);
            var toPage = Math.floor(to / PAGESIZE);


            // If the data for a page is already loaded (determined by when data[pageNumber * PAGESIZE] has a value)
            // then returns without requesting any further data.
            // When scrolling down the page, this logic will repeatedly specify data to be loaded, but the timeout 
            // on the ajax call stops data being retrieved until scrolling has stopped.

            while (data[fromPage * PAGESIZE] !== undefined && fromPage < toPage)
                fromPage++;


            while (data[toPage * PAGESIZE] !== undefined && fromPage < toPage)
                toPage--;

            if (fromPage > toPage || ((fromPage == toPage) && data[fromPage * PAGESIZE] !== undefined)) {
                // TODO:  look-ahead
                return;
            }

            var url = urlBase + "?skip=" + (fromPage * PAGESIZE) + "&take=" + (((toPage - fromPage) * PAGESIZE) + PAGESIZE);

            /* switch (sortcol) {
            case "diggs":
            url += ("&sort=" + ((sortdir > 0) ? "digg_count-asc" : "digg_count-desc"));
            break;
            }*/

            if (h_request != null) {
                // When scrolling down the grid, the timeout stops data being retrieved until scrolling has stopped.
                clearTimeout(h_request);
            }

            h_request = setTimeout(function () {
                for (var i = fromPage; i <= toPage; i++)
                    data[i * PAGESIZE] = null; // null indicates a 'requested but not available yet'

                onDataLoading.notify({ from: from, to: to });

                lastRequestFromPage = fromPage;
                lastRequestToPage = toPage;

                req = $.ajax({
                    url: url,
                    cache: true,
                    dataType: "json",
                    success: onSuccess,
                    error: onError,
                    complete: function () { req = null; }, // TODO IS IT SENSIBLE TO SET REQ=NULL? (NOT USING PROMISES)
                    fromPage: fromPage,
                    toPage: toPage
                });

                /*console.debug("req.fromPage [after ajax] = " + req.fromPage);
                console.debug("req.toPage [after ajax] = " + req.toPage);
                if (data) {
                console.debug("data.length [after ajax] = " + data.length);
                console.debug("data used items [onSuccess] = " + debugCountPopulatedDataItems());
                }*/

            }, 50);
        }

        function onError(jqXHR, textStatus, errorThrown) {
            if (errorThrown == "abort") {
                return;
            }
            alert("error loading pages " + this.fromPage + " to " + this.toPage);
        }


        function onSuccess(resp) {
            /*console.log("Entering onSuccess");*/
            var from = this.fromPage * PAGESIZE,
                to = from + resp.products.length;

            data.length = resp.total;

            for (var i = 0; i < resp.products.length; i++) {
                data[from + i] = resp.products[i];
                data[from + i].index = from + i;
            }

            /*console.debug("from [onSuccess] = " + from);
            console.debug("to [onSuccess] = " + to);
            console.debug("this.fromPage [onSuccess] = " + this.fromPage);
            console.debug("this.toPage [onSuccess] = " + this.toPage);
            console.debug("resp.products.length [onSuccess] = " + resp.products.length);
            if (data) {
            console.debug("data.length [onSuccess] = " + data.length);
            console.debug("data used items [onSuccess] = " + debugCountPopulatedDataItems());
            }*/

            req = null;

            onDataLoaded.notify({ from: from, to: to });
        }


        function reloadData(from, to) {
            for (var i = from; i <= to; i++)
                delete data[i];

            ensureData(from, to);
        }


        function setSort(column, dir) {
            sortcol = column;
            sortdir = dir;
            clear();
        }

        function setSearch(str) {
            searchstr = str;
            clear();
        }

        function debugCountPopulatedDataItems() {
            var usedItems = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i]) {
                    usedItems++;
                }
            }
            return usedItems;
        }

        init();

        return {
            // properties
            "data": data,

            // methods
            "clear": clear,
            "isDataLoaded": isDataLoaded,
            "ensureData": ensureData,
            "reloadData": reloadData,
            "setSort": setSort,
            "setSearch": setSearch,

            // events
            "onDataLoading": onDataLoading,
            "onDataLoaded": onDataLoaded,
            "onRequestAborted": onRequestAborted
        };
    }

    // Slick.Data.PageLoader
    $.extend(true, window,
        {
            Slick:
                {
                    Data:
                        {
                            PageLoader: PageLoader
                        }
                }
        });
})(jQuery);