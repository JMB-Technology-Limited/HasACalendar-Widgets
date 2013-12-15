/**
 * HasACalendar.co.uk Event List Widget
 * @license BSD-3 Clause License
 */

var ICanHasACalendarWidgetListEvents = {
	cssAdded: false,
	callBackFunctionCount: 0,
	place: function(divid, site, options) {
		var usingOptions = {
			eventCount: 5,
			title: 'Events',
			maxStringLength: 300,
			groupID: undefined,
			openInNewWindow: true,
			loadCSS: true
		}
		for (var prop in options) {
			if (options.hasOwnProperty(prop)) {
				usingOptions[prop] = options[prop];
			}
		}
		var div = document.getElementById(divid);
		if (!div) return;
		var moreURL;
		if (usingOptions.groupID) {
			moreURL = "http://"+site+".hasacalendar.co.uk/group/"+usingOptions.groupID;
		} else if (usingOptions.venueID) {
			moreURL = "http://"+site+".hasacalendar.co.uk/venue/"+usingOptions.venueID;
		} else if (usingOptions.countryCode) {
			moreURL = "http://"+site+".hasacalendar.co.uk/country/"+usingOptions.countryCode.toUpperCase();
		} else {
			moreURL = "http://"+site+".hasacalendar.co.uk";
		}

		var target = usingOptions['openInNewWindow'] ? ' target="_BLANK"' : '';

		div.innerHTML = '<div class="ICanHasACalendarWidgetListEventsData">'+
				'<div class="ICanHasACalendarWidgetListEventsHeader"><a href="'+moreURL+'" '+target+' id="'+divid+'Title">'+ICanHasACalendarWidgetListEvents.escapeHTML(usingOptions.title)+'</a></div>'+
				'<div class="ICanHasACalendarWidgetListEventsEvents" id="'+divid+'Data">Loading</div>'+
				'<div class="ICanHasACalendarWidgetListEventsFooter">'+
					'<div class="ICanHasACalendarWidgetListEventsFooterMore"><a href="'+moreURL+'" '+target+'>See more ...</a></div>'+
					'<div class="ICanHasACalendarWidgetListEventsFooterCredit">Powered by <a href="http://ican.hasacalendar.co.uk" '+target+'>Has A Calendar</a></div>'+
				'</div>'+
			'</div>';
		var dataDiv = document.getElementById(divid+"Data");
		var headTag = document.getElementsByTagName('head').item(0);

		if (!ICanHasACalendarWidgetListEvents.cssAdded && usingOptions.loadCSS) {	
			var link = document.createElement("link");
			link.type = "text/css"; 
			link.href = "http://hasacalendar.co.uk/widgetcss/listevents.css?v=1"; 
			link.rel = "stylesheet"; 
			headTag.appendChild(link);
			ICanHasACalendarWidgetListEvents.cssAdded = true;
		}

		ICanHasACalendarWidgetListEvents.callBackFunctionCount++;
		window["ICanHasACalendarWidgetListEventsCallBackFunction"+ICanHasACalendarWidgetListEvents.callBackFunctionCount] = function(data) {			
			var html = '';
			var limit = Math.min(data.data.length, usingOptions.eventCount);
			if (limit <= 0) {
				html = '<div class="ICanHasACalendarWidgetListEventsEventNone">No events</div>';
			} else {
				for (var i=0;i<limit;i++) {
					html += ICanHasACalendarWidgetListEvents.htmlFromEvent(data.data[i], usingOptions.maxStringLength, target);
				}
			}

			dataDiv.innerHTML=html;

			if (!usingOptions.title) {
				var titleDiv = document.getElementById(divid+"Title");
				titleDiv.innerHTML = data.title;
			}
		}
		var url;
		if (usingOptions.groupID) {
			url = "http://"+site+".api1.hasacalendar.co.uk/group/"+usingOptions.groupID+"/jsonp";
		} else if (usingOptions.venueID) {
			url = "http://"+site+".api1.hasacalendar.co.uk/venue/"+usingOptions.venueID+"/jsonp";
		} else if (usingOptions.countryCode) {
			url = "http://"+site+".api1.hasacalendar.co.uk/country/"+usingOptions.countryCode.toUpperCase()+"/jsonp";
		} else {			
			url = "http://"+site+".api1.hasacalendar.co.uk/event/jsonp";
		}

		var script = document.createElement("script");
		script.type = "text/javascript"; 
		script.src = url+"?callback=ICanHasACalendarWidgetListEventsCallBackFunction"+ICanHasACalendarWidgetListEvents.callBackFunctionCount;
		headTag.appendChild(script);
	},
	htmlFromEvent: function(event, maxLength, target) {
		var html = '<div class="ICanHasACalendarWidgetListEventsEvent">'
		html += '<div class="ICanHasACalendarWidgetListEventsDate">'+event.start.displaylocal+'</div>';
		html += '<div class="ICanHasACalendarWidgetListEventsSummary"><a href="'+event.siteurl+'" '+target+'>'+ICanHasACalendarWidgetListEvents.escapeHTML(event.summaryDisplay)+'</a></div>';
		html += '<div class="ICanHasACalendarWidgetListEventsDescription">'+ICanHasACalendarWidgetListEvents.escapeHTMLNewLine(event.description, maxLength)+'</div>';
		html += '<a class="ICanHasACalendarWidgetListEventsMoreLink" href="'+event.siteurl+'" '+target+'>More Info</a>';
		html += '<div class="ICanHasACalendarWidgetListEventsClear"></div>';	
		return html+'</div>';
	},			
	escapeHTML: function(str) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	},
	escapeHTMLNewLine: function(str, maxLength) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		var out =  div.innerHTML;
		if (out.length > maxLength) {
			out = out.substr(0,maxLength)+" ...";
		}
		return out.replace(/\n/g,'<br>');
	}
};

