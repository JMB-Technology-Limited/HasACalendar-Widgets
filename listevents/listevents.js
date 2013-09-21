/**
 * HasACalendar.co.uk Event List Widget
 * @license BSD-3 Clause License
 */

var ICanHasACalendarWidgetListEvent = {
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
			moreURL = "http://"+site+".hasacalendar.co.uk/country/"+usingOptions.countryCode;
		} else {
			moreURL = "http://"+site+".hasacalendar.co.uk";
		}

		var target = usingOptions['openInNewWindow'] ? ' target="_BLANK"' : '';

		div.innerHTML = '<div class="ICanHasACalendarWidgetListEventData">'+
				'<div class="ICanHasACalendarWidgetListEventHeader"><a href="'+moreURL+'" '+target+' id="'+divid+'Title">'+ICanHasACalendarWidgetListEvent.escapeHTML(usingOptions.title)+'</a></div>'+
				'<div class="ICanHasACalendarWidgetListEventEvents" id="'+divid+'Data">Loading</div>'+
				'<div class="ICanHasACalendarWidgetListEventFooter">'+
					'<div class="ICanHasACalendarWidgetListEventFooterMore"><a href="'+moreURL+'" '+target+'>See more ...</a></div>'+
					'<div class="ICanHasACalendarWidgetListEventFooterCredit">Powered by <a href="http://ican.hasacalendar.co.uk" '+target+'>Has A Calendar</a></div>'+
				'</div>'+
			'</div>';
		var dataDiv = document.getElementById(divid+"Data");
		var headTag = document.getElementsByTagName('head').item(0);

		if (!ICanHasACalendarWidgetListEvent.cssAdded && usingOptions.loadCSS) {	
			var link = document.createElement("link");
			link.type = "text/css"; 
			link.href = "http://hasacalendar.co.uk/widgetcss/listevents.css?v=1"; 
			link.rel = "stylesheet"; 
			headTag.appendChild(link);
			ICanHasACalendarWidgetListEvent.cssAdded = true;
		}

		ICanHasACalendarWidgetListEvent.callBackFunctionCount++;
		window["ICanHasACalendarWidgetListEventCallBackFunction"+ICanHasACalendarWidgetListEvent.callBackFunctionCount] = function(data) {			
			var html = '';
			var limit = Math.min(data.data.length, usingOptions.eventCount);
			if (limit <= 0) {
				html = '<div class="ICanHasACalendarWidgetListEventEventNone">No events</div>';
			} else {
				for (var i=0;i<limit;i++) {
					html += ICanHasACalendarWidgetListEvent.htmlFromEvent(data.data[i], usingOptions.maxStringLength, target);
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
			url = "http://"+site+".api1.hasacalendar.co.uk/country/"+usingOptions.countryCode+"/jsonp";
		} else {			
			url = "http://"+site+".api1.hasacalendar.co.uk/event/jsonp";
		}

		var script = document.createElement("script");
		script.type = "text/javascript"; 
		script.src = url+"?callback=ICanHasACalendarWidgetListEventCallBackFunction"+ICanHasACalendarWidgetListEvent.callBackFunctionCount;
		headTag.appendChild(script);
	},
	htmlFromEvent: function(event, maxLength, target) {
		var html = '<div class="ICanHasACalendarWidgetListEventEvent">'
		html += '<div class="ICanHasACalendarWidgetListEventDate">'+event.start.displaylocal+'</div>';
		html += '<div class="ICanHasACalendarWidgetListEventSummary"><a href="'+event.siteurl+'" '+target+'>'+ICanHasACalendarWidgetListEvent.escapeHTML(event.summaryDisplay)+'</a></div>';
		html += '<div class="ICanHasACalendarWidgetListEventDescription">'+ICanHasACalendarWidgetListEvent.escapeHTMLNewLine(event.description, maxLength)+'</div>';
		html += '<a class="ICanHasACalendarWidgetListEventMoreLink" href="'+event.siteurl+'" '+target+'>More Info</a>';
		html += '<div class="ICanHasACalendarWidgetListEventClear"></div>';	
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

