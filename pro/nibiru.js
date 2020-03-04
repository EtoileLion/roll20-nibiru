on("chat:message", function(msg) {
	if(msg.type === "api" && msg.content.indexOf("!nibroll") !== -1) {
		let msgtext = msg.content.slice(msg.content.indexOf(" ")+1).trim();
		let options = msgtext.split("|");
		log(options);
		if(options.length < 3) { sendChat("Nibiru Roller","/w "+msg.who.replace(" (GM)","")+" Dice Roll Error. Expected 3 values, received "+msgtext+" Please report this error to EtoileLion."); return; }
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
	if(msg.type === "api" && msg.content.indexOf("!nibcroll") !== -1) {
		let msgtext = msg.content.slice(msg.content.indexOf(" ")+1).trim();
		let options = msgtext.split("|");
		log(options);
		if(options.length < 3) { sendChat("Nibiru Roller","/w "+msg.who.replace(" (GM)","")+" Dice Roll Error. Expected 3 values, received "+msgtext+" Please report this error to EtoileLion."); return; }
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
		let total = results.reduce((a,b) => a+b,0);
		log(results);
		results = results.map((dievalue)=> "<div class=\"sheet-die"+dievalue+"\">"+dievalue+"</div>");
		log(results);
		let output = "&{template:nibirucontest} {{name="+options[0]+"}} {{dierow="+results.join("+")+"}} {{total="+total+"}} "+(Math.sign(options[1]) ? "{{gravity="+((options[1] > 0) ? "+" : "-")+"}} " : "")+(Math.sign(options[2]) ? "{{modifier="+((options[2] > 0) ? "+" : "-")+"}} " : "")+((fours >= 3 || (fours == 0 && ones >= 3))? " {{ruleofthrees}}":"");
		sendChat(msg.who,output);
	}
});

on("chat:message", function(msg) {
	if(msg.type === "api" && msg.content.indexOf("!nibsroll") !== -1) {
		let msgtext = msg.content.slice(msg.content.indexOf(" ")+1).trim();
		let options = msgtext.split("|");
		log(options);
		if(options.length < 2) { sendChat("Nibiru Roller","/w "+msg.who.replace(" (GM)","")+" Dice Roll Error. Expected 2 values, received "+msgtext+" Please report this error to EtoileLion."); return; }
		options[1] = parseInt(options[1]);
		log(options);
		let fours = 0;
		let ones = 0;
		let toroll = options[1];
		let results = [];
		while(toroll > 0) {
			let dievalue = randomInteger(4);
			results.push(dievalue);
			toroll--;
		}
		let total = results.reduce((a,b) => a+b,0);
		results = results.map((dievalue)=> "<div class=\"sheet-die"+dievalue+"\">"+dievalue+"</div>");
		let output = "&{template:nibiruspecial} {{name="+options[0]+"}} {{dierow="+results.join(",")+"}} {{total="+total+"}}";
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
		  let q = addmsg[Math.floor(Math.random() * addmsg.length)];
			sendChat("Nibiru",'&{template:quote} {{quote='+q.quote.replace("#CHARNAME#",character.get("name"))+'}}'+((q.hasOwnProperty("by")) ? "{{by="+q.by+"}}" : ""));		  
	}
});

on("chat:message", function(msg) {
	if(msg.type === "api" && msg.content.indexOf("!delpage") !== -1) {
		let msgtext = msg.content.slice(msg.content.indexOf(" ")+1).trim();
		let options = msgtext.split("|");
		log(options[1]);
		if(options.length < 2) { sendChat("Nibiru","/w "+msg.who.replace(" (GM)","")+" To confirm your loss of memory, close the memory page, and then click here. [Really Delete Memories](!delpage "+msgtext+"|1)"); } else {
		//Select Character
		let pagetodel = getObj("character",options[0]);
		//Kujio Proofing.
		if(pagetodel == undefined) { return; }
		let [ownername,pageno] = pagetodel.get("name").split(/\sJournal\sPage\s/);
		let allthings = findObjs({_type:"character","controlledby":pagetodel.get("controlledby")});
		let character = allthings.filter((x) => x.get("name") == ownername)[0];
		log(ownername);
		log(pageno);
		log(character);			
		//Adjust character page number
		let mempages = findObjs({_type:"attribute",_characterid:character.get("_id"),"name":"memorypages"})[0];
		mempages.set("current",parseInt(mempages.get("current"))-1);
		log(mempages);
		//Renumber Pages
		let pages = allthings.filter((x) => x.get("name").includes(ownername) && x.get("name") != ownername && parseInt(x.get("name").split(/Page\s/)[1]) > parseInt(pageno));		
		log(pages);		
		pages.forEach((x) => {
			let y = x.get("name");
			let no = y.split(/Page\s/)[1];			
			x.set("name",y.replace(no,(parseInt(no)-1).toString()));
		})
		//Delete Target Page/
		pagetodel.remove();
		//Send Ominous message
			let q = deletemsg[Math.floor(Math.random() * deletemsg.length)];
			sendChat("Nibiru",'&{template:quote} {{quote='+q.quote.replace("#CHARNAME#",ownername)+'}}'+((q.hasOwnProperty("by")) ? "{{by="+q.by+"}}" : ""));
		}
	}
});

on("chat:message", function(msg) {
	if(msg.type === "api" && msg.content.indexOf("!givepage") !== -1) {
		let msgtext = msg.content.slice(msg.content.indexOf(" ")+1).trim();
		let options = msgtext.split("|");
		log(options[1]);
		//Select Character
		let pagetodel = getObj("character",options[0]);
		//Kujio Proofing.
		if(pagetodel == undefined) { return; }	
		let [ownername,pageno] = pagetodel.get("name").split(/\sJournal\sPage\s/);
		log(ownername);
		log(pageno);
		if(options.length < 2) { 
			let gallthings = findObjs({_type:"character"}).filter((x)=> !x.get("name").includes("Journal Page") && x.get("controlledby") != "" && !x.get("name").includes(ownername));
			let append = ""
			gallthings.forEach((x) => {
				append += " ["+x.get("name")+"](!givepage "+options[0]+"|"+x.get("_id")+")";
			});
			sendChat("Nibiru","/w "+msg.who.replace(" (GM)","")+" To confirm your loss of memory, close the memory page, and then click the name of the person to whom you should send your memories..."+append); 
		} else {		
			let allthings = findObjs({_type:"character","controlledby":pagetodel.get("controlledby")}); 
			log(allthings);
			let character = allthings.filter((x) => x.get("name") == ownername)[0]; 
			log(character);
			let tocharacter = getObj("character",options[1]); 
			log(tocharacter);
			//Adjust character page number
			let mempages = findObjs({_type:"attribute",_characterid:character.get("_id"),"name":"memorypages"})[0];
			mempages.set("current",parseInt(mempages.get("current"))-1);
			let newpages = findObjs({_type:"attribute",_characterid:options[1],"name":"memorypages"})[0];
			if(newpages == undefined) { newpages = createObj("attribute", { _characterid:options[1], "name":"memorypages", "current":0}); }
			newpages.set("current",parseInt(newpages.get("current"))+1);
			log(mempages);
			log(newpages);
			//Renumber Pages
			let pages = allthings.filter((x) => x.get("name").includes(ownername) && x.get("name") != ownername && parseInt(x.get("name").split(/Page\s/)[1]) > parseInt(pageno));		
			log(pages);		
			pages.forEach((x) => {
				let y = x.get("name");
				let no = y.split(/Page\s/)[1];			
				x.set("name",y.replace(no,(parseInt(no)-1).toString()));
			})
			//Transfer Target Page
			pagetodel.set("controlledby",tocharacter.get("controlledby"));
			pagetodel.set("name",tocharacter.get("name")+" Journal Page "+newpages.get("current"));
			//Send Ominous message
			let q = transfermsg[Math.floor(Math.random() * transfermsg.length)];
			sendChat("Nibiru",'&{template:quote} {{quote='+q.quote.replace("#CHARNAME#",ownername).replace("#CHARNAME2#",tocharacter.get("name"))+'}}'+((q.hasOwnProperty("by")) ? "{{by="+q.by+"}}" : ""));
		}
	}
});
let addmsg = [
{quote: "Forbidden to remember, terrified to forget; it was a hard line to walk.", by:"Stephanie Meyer, 'New Moon'"},
{quote: "The advantage of a bad memory is that one enjoys several times the same good things for the first time.", by: "Friedrich Nietzsche"},
{quote: "Remember tonight... for it is the beginning of always.", by: "Dante Alighieri"},
	{quote: "The birth of memory; an event so wonderful it is to be admired just for its very existance."}
];
let transfermsg = [
	{quote: "As breath on the wind, so too are memories, drifting from soul to soul..."},
	{quote: "Another's thoughts pressing through #CHARNAME#'s mind. Not anymore. Home they go, seeking their new place. Or is it their old place?"},
	{quote: "These memories, they were not mine; instead perhaps, art they thine?", by:"Unknown"},
		{quote: "'Time's the thief of memory.' Sometimes, Time takes a more tangible form.", by:"Stephen King, 'The Gunslinger', Unknown"}
];
let deletemsg = [
{quote: "Like sand through fingertips, memories slip from #CHARNAME#'s grasp..."},
{quote: "False memories are but chaff to be discarded. But what will fill their place?"},
{quote: "Take a man’s memories and you take all of him. Chip away a memory at a time and you destroy him as surely as if you hammered nail after nail through his skull.",by: "Mark Lawrence"},
{quote: "What are we but our memories? What do we become if we lose them?"},
{quote: "If you tell the truth, you don't have to remember anything.", by:"Mark Twain"},
{quote: "If you wish to forget anything on the spot, make a note that this thing is to be remembered.", by:"Edgar Allan Poe"}
];