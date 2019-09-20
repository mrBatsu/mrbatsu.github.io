/*
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2018 Jaume Fuster i Claris
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

// "Thus, programs must be written for people to read, and only incidentally for machines to execute."
// TODO: Commenting.


// ---------- CONFIGURATION ----------

// div.innerHTML : {a.innerHTML : a.href}
var sites = {
			"photo": {
				"flickr/activity"		: "https://flickr.com/activity/",
				"flickr/organize"		: "https://flickr.com/organize/",
				"flickr/mine"			: "https://flickr.com/photos/maique/",
				"flickr/home"			: "https://flickr.com/",
				"instagram/home"		: "https://instagram.com/",
				"instagram/mine"		: "https://instagram.com/maique"
			},
			"social": {
				"github"				: "https://github.com/mrBatsu",
				"blog"					: "https://xanato.net/",
				"twitter"				: "https://twitter.com",
				"twitter/maique/mrBatsu" : "https://twitter.com/maique/lists/mrBatsu1",
				"mastodon"				: "https://mastodon.social/web/timelines/home"
			},
			"email": {
				"proton"				: "https://mail.protonmail.com/inbox",
				"fastmail"				: "https://www.fastmail.com/mail/Inbox/",
				"tutanota"				: "https://mail.tutanota.com/mail/"
			},
			"reddit": { 
				"reddit/home"			: "https://www.reddit.com/",
				"reddit/manjaro"		: "https://www.reddit.com/r/ManjaroLinux/",
				"reddit/popOS"			: "https://www.reddit.com/r/pop_os/",
				"reddit/wcgw"			: "https://www.reddit.com/r/Whatcouldgowrong/",
				"reddit/itHadToBeBrazil"	: "https://www.reddit.com/r/ItHadToBeBrazil/"
			},
			"news": {
				"theGuardian"			: "https://guardian.com/",
				"wired"				: "https://www.wired.com/",
				"quartz"			: "https://qz.com/",
				"makeUseOf"			: "https://www.makeuseof.com/"
			},
			"myStuff": {
				"maiquemadeira.com"		: "https://maiquemadeira.com",
				"pocket"			: "https://app.getpocket.com",
				"coffee"			: "https://www.buymeacoffee.com/dashboard",
				"darksky"			: "https://darksky.net/forecast/38.716,-9.1522/ca12/en"
			}
		};

var search = "https://duckduckgo.com/";		// The search engine
var query  = "q";							// The query variable name for the search engine

var pivotmatch = 0;
var totallinks = 0;
var prevregexp = "";

// ---------- BUILD PAGE ----------
function matchLinks(regex = prevregexp) {
	totallinks = 0;
	pivotmatch = regex == prevregexp ? pivotmatch : 0;
	prevregexp = regex;
	pivotbuffer = pivotmatch;
	p = document.getElementById("links");
	while (p.firstChild) {
		p.removeChild(p.firstChild);
	}
	match = new RegExp(regex ? regex : ".", "i");
	gmatches = false; // kinda ugly, rethink
	for (i = 0; i < Object.keys(sites).length; i++) {
		matches = false;
		sn = Object.keys(sites)[i];
		section = document.createElement("div");
		section.id = sn;
		section.innerHTML = sn;
		section.className = "section";
		inner = document.createElement("div");
		for (l = 0; l < Object.keys(sites[sn]).length; l++) {
			ln = Object.keys(sites[sn])[l];
			if (match.test(ln)) {
				link = document.createElement("a");
				link.href = sites[sn][ln];
				link.innerHTML = ln;
				if (!pivotbuffer++ && regex != "") {
					link.className = "selected";
					document.getElementById("action").action = sites[sn][ln];
					document.getElementById("action").children[0].removeAttribute("name");
				}
				inner.appendChild(link);
				matches = true;
				gmatches = true;
				totallinks++;
			}
		}
		section.appendChild(inner);
		matches ? p.appendChild(section) : false;
	}
	if (!gmatches || regex == "") {
		document.getElementById("action").action = search;
		document.getElementById("action").children[0].name = query;
	}
	document.getElementById("main").style.height = document.getElementById("main").children[0].offsetHeight+"px";
}

document.onkeydown = function(e) {
	switch (e.keyCode) {
		case 38:
			pivotmatch = pivotmatch >= 0 ? 0 : pivotmatch + 1;
			matchLinks();
			break;
		case 40:
			pivotmatch = pivotmatch <= -totallinks + 1 ? -totallinks + 1 : pivotmatch - 1;
			matchLinks();
			break;
		default:
			break;
	}
	document.getElementById("action").children[0].focus();
}

document.getElementById("action").children[0].onkeypress = function(e) {
	if (e.key == "ArrowDown" || e.key == "ArrowUp") {
		return false;
	}
}

function displayClock() {
	now = new Date();
	clock = (now.getHours() < 10 ? "0"+now.getHours() : now.getHours())+":"
			+(now.getMinutes() < 10 ? "0"+now.getMinutes() : now.getMinutes())+":"
			+(now.getSeconds() < 10 ? "0"+now.getSeconds() : now.getSeconds());
	document.getElementById("clock").innerHTML = clock;
}

window.onload = matchLinks();
displayClock();
setInterval(displayClock, 1000);
