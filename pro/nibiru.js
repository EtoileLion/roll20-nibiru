on("chat:message", function(msg) {
	if(msg.type === "api" && msg.content.indexOf("!nibroll") !== -1) {
		let msgtext = msg.content.slice(msg.content.indexOf(" ")+1).trim();
		let options = msgtext.split("|");
		log(options);
		if(options.length < 3) { sendChat("Nibiru Roller","/w "+msg.who.replace(" (GM)","")+" Dice Roll Error. Expected 3 values, received "+msgtext+" Please report this error to EtoileLion."); return; }
		if(options[1] == undefined) { options[1] = "0"; }
		options[1] = Math.sign(parseInt(options[1]))*Math.floor(parseInt(Math.abs(options[1]))/2);
		options[2] = parseInt(options[2]);
		log(options);
		let fours = 0;
		let ones = 0;
		let toroll = 3+options[1]+options[2];
		let results = [];
		while(toroll > 0) {
			let dievalue = randomInteger(4);
			results.push(dievalue);
			if (dievalue == 1) {
				ones++;
			} else if (dievalue == 4) {
				fours++;
			}
			toroll--;
		}
		log(results);
		results = results.map((dievalue)=> "<div class=\""+((dievalue == 4) ? " sheet-critdie " : "")+((dievalue === 1 && fours == 0) ? " sheet-cfaildie " : "")+"sheet-die"+dievalue+"\">"+dievalue+"</div>");
		log(results);
		let output = "&{template:nibirunormal} {{name="+options[0]+"}} {{dierow="+results.join(",")+"}} {{fours=[["+fours+"]]}} {{ones=[["+ones+"]]}} "+(Math.sign(options[1]) ? "{{gravity="+((options[1] > 0) ? "+" : "-")+"}} " : "")+(Math.sign(options[2]) ? "{{modifier="+((options[2] > 0) ? "+" : "-")+"}} " : "");
		sendChat(msg.who,output);
	}
});

on("chat:message", function(msg) {
	if(msg.type === "api" && msg.content.indexOf("!addpage") !== -1) {
		let msgtext = msg.content.slice(msg.content.indexOf(" ")+1).trim();
		let character = getObj("character",msgtext);
		let owner = character.get("controlledby").split(",");
		if (owner.length > 1) { sendChat("Warning","/w "+msg.who.replace(" (GM)","")+" Character has more than one 'Controlled By', using first entry in list."); }
		owner = owner[0];
		if (owner == "") { sendChat("Error","/w "+msg.who.replace(" (GM)","")+" Character does not have a controller."); return; }
		let curpages = findObjs({_type:"attribute",_characterid:msgtext,"name":"memorypages"});
		if(curpages.length == 0) {
		  curpages = createObj("attribute", {
		      _characterid:msgtext,
		      "name":"memorypages",
		      "current":"0"
		  });
		} else { curpages = curpages[0]; }
		let curpage = parseInt(curpages.get("current"))+1;
		let newsheet = createObj("character", {
			"name": character.get("name")+" Journal Page "+curpage,
			"inplayerjournals": owner,
			"controlledby":owner
		});
		curpages.set("current",curpage);
		createObj("attribute", {
		      _characterid:newsheet.get("id"),
		      "name":"sheettype",
		      "current":"journal"
		  });
	}
});
