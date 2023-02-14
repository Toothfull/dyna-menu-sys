function markdownToHTML(markdownString) {
	let markdownLines = markdownString.split('\n');
	let markdownLinesCount = markdownLines.length;

	let htmlLines = [];

	for (let lineNumber = 0; lineNumber < markdownLinesCount; lineNumber++) {
		let markdownLine = markdownLines[lineNumber];

		let previousLines = markdownLines.slice(0,lineNumber);
		let nextLines = markdownLines.slice(lineNumber+1);

		// Headings
		let didHeadingChange = false;
		[markdownLine,didHeadingChange] = heading(markdownLine)

		// Lists
		let didUnorderedListChange = false;
		[markdownLine,didUnorderedListChange] = unorderedList(markdownLine,previousLines,nextLines);
		let didOrderedListChange = false;
		[markdownLine,didOrderedListChange] = orderedList(markdownLine,previousLines,nextLines);

		if (markdownLine.length <= 0) continue;

		markdownLine = markdownLine.replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
		markdownLine = markdownLine.replaceAll(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
		markdownLine = markdownLine.replaceAll(/__(.*?)__/g, '<u>$1</u>'); // Underline
		markdownLine = markdownLine.replaceAll(/~~(.*?)~~/g, '<s>$1</s>'); // Strikethrough
		markdownLine = markdownLine.replaceAll(/!\[(.*?)\]\((.*?)\)/g, '<img src=\'$2\' alt=\'$1\' />'); // Images
		markdownLine = markdownLine.replaceAll(/\[(.*?)\]\((.*?)\)/g, '<a href=\'$2\'>$1</a>'); // Links

		if (didHeadingChange||didUnorderedListChange||didOrderedListChange) {
			htmlLines.push(markdownLine);
		} else {
			htmlLines.push(`<p>${markdownLine}</p>`);
		}
	}

	// Remove empty lines
	htmlLines = htmlLines.filter(function(line){
		return line.length>0;
	});

	return htmlLines.join('\n');
}

function heading(markdownLine){
	for (let count = 6; count >= 1; count--){
		let prefix = '#'.repeat(count);
		if (markdownLine.startsWith(prefix)) {
			return [`<h${count}>${markdownLine.slice(prefix.length)}</h${count}>`,true];
		}
	}

	return [markdownLine, false];
}

function unorderedList(markdownLine,previousLines,nextLines){
	let previousLine = '';
	if (previousLines.length>0){
		previousLine = previousLines[previousLines.length-1];
	}

	let nextLine = '';
	if (nextLines.length>0){
		nextLine = nextLines[0];
	}

	if (markdownLine.startsWith('* ')){
		let listText = markdownLine.slice(2);

		let htmlLine = `<li>${listText}</li>`;
		if (previousLine.length <= 0) {
			htmlLine = `<ul>\n${htmlLine}`;
		}
		if (nextLine.length <= 0) {
			htmlLine = `${htmlLine}\n</ul>`;
		}

		return [htmlLine,true];
	}

	return [markdownLine,false];
}

function orderedList(markdownLine,previousLines,nextLines){
	let previousLine = '';
	if (previousLines.length>0){
		previousLine = previousLines[previousLines.length-1];
	}

	let nextLine = '';
	if (nextLines.length>0){
		nextLine = nextLines[0];
	}

	let regexMatch = markdownLine.match(/^\d\. (.+)$/);
	if (regexMatch) {
		let listText = regexMatch[1];

		let htmlLine = `<li>${listText}</li>`;
		if (previousLine.length <= 0) {
			htmlLine = `<ol>\n${htmlLine}`;
		}
		if (nextLine.length <= 0) {
			htmlLine = `${htmlLine}\n</ol>`;
		}

		return [htmlLine,true];
	}

	return [markdownLine,false];
}

let whatTypeOfListAreWeCurrentlyOn = null

function HTMLToMarkdown( htmlText ) {
	let htmlLines = $('#menuView').html().split('\n');
	let htmlLinesCount = htmlLines.length;

	let markdownLines = [];

	for (let lineNumber = 0; lineNumber < htmlLinesCount; lineNumber++) {
		let htmlLine = htmlLines[lineNumber];
		//if (htmlLine.length <= 0) continue;

		let previousLines = htmlLines.slice(0,lineNumber);

		let previousLine = '';
		if (previousLines.length>0){
			previousLine = previousLines[previousLines.length-1];
		}

		let nextLines = htmlLines.slice(lineNumber+1);

		if (htmlLine.match(/<ul>/) != null) {
			//if (previousLine!=''){
				markdownLines.push( '' );
			//}
			whatTypeOfListAreWeCurrentlyOn = 'ul'
			continue;
		}
		if (htmlLine.match(/<\/ul>/) != null) {
			/*if (previousLine!=''){
				markdownLines.push( '' );
			}*/
			whatTypeOfListAreWeCurrentlyOn = null
			continue;
		}
		if (htmlLine.match(/<ol>/) != null) {
			//if (previousLine!=''){
				markdownLines.push( '' );
			//}
			whatTypeOfListAreWeCurrentlyOn = 'ol'
			continue;
		}
		if (htmlLine.match(/<\/ol>/) != null) {
			//if (previousLine!=''){
			//	markdownLines.push( '' );
			//}
			whatTypeOfListAreWeCurrentlyOn = null
			continue;
		}


		let cringe = htmlLine.replaceAll( /<p>(.*)<\/p>/g, "$1" )
		let wasThereAParagraphTagAndDoINeedANewLine = false
		if (cringe!=htmlLine){
			//markdownLines.push(cringe)
			//markdownLines.push( '' );
			htmlLine = cringe
			wasThereAParagraphTagAndDoINeedANewLine = true
		}


		// let c = htmlLine.replaceAll(/<ul>/, "")
		// if (c != htmlLine){
		// 	console.log("c",c)
		// 	console.log("avc",htmlLine)
		// 	markdownLines.push(c);
		// 	continue;
		// }
		// let d = htmlLine.replaceAll(/<\/ul>/, "")
		// if (d != htmlLine){
		// 	console.log("d",d)
		// 	console.log("no",htmlLine)
		// 	markdownLines.push(d);
		// 	continue;
		// }
		// let a = htmlLine.replaceAll(/<ol>/g, "")
		// if (a != htmlLine){
		// 	console.log("a",a)
		// 	console.log("aaaaaaa",htmlLine)
		// 	markdownLines.push(a);
		// 	continue;
		// }
		// let b = htmlLine.replaceAll(/<\/ol>/g, "")
		// if (b != htmlLine){
		// 	console.log("b",b)
		// 	console.log("htmlLine",htmlLine)
		// 	markdownLines.push(b);
		// 	continue;
		// }

		//if (htmlLine.length <= 0) continue;

		let didHeadingChange = false;
		[htmlLine, didHeadingChange] = markdownHeading(htmlLine);
		if (didHeadingChange == true) {
			markdownLines.push(htmlLine);
			markdownLines.push( '' );
			continue;
		}

		let didListChange = false;
		[htmlLine, didListChange] = markdownUnorderedList(htmlLine,nextLines);
		if (didListChange == true)	{	
			/*for (let i = 0; i < listLines.length; i++) {
				markdownLines.push(listLines[i]);
			}*/
			markdownLines.push(htmlLine);
			continue;
		}

		let didOrderedListChange = false;
		[htmlLine,didOrderedListChange] = markdownOrderedList(htmlLine,nextLines);
		if (didOrderedListChange == true) {
			/*htmlLine = htmlLine.replaceAll( /<strong>(.*)<\/strong>/g, "**$1**" )
			for (let i = 0; i < orderedListLines.length; i++) {
				markdownLines.push(orderedListLines[i]);
			}*/
			markdownLines.push(htmlLine);
			continue;
		}

		//if (htmlLine.length <= 0) continue;

		if (didHeadingChange == false || didListChange == false || didOrderedListChange == false) {
			htmlLine = htmlLine.replaceAll( /<strong>(.*)<\/strong>/g, "**$1**" )
			htmlLine = htmlLine.replaceAll( /<u>(.*)<\/u>/g, "__$1__" )
			htmlLine = htmlLine.replaceAll( /<em>(.*)<\/em>/g, "*$1*" )
			htmlLine = htmlLine.replaceAll( /<s>(.*)<\/s>/g, "~~$1~~" )
			htmlLine = htmlLine.replaceAll( /<a href="(.*)">(.*)<\/a>/g, "[$2]($1)" )

			if (htmlLine.length > 0) {
				markdownLines.push(htmlLine)
			}

			if (wasThereAParagraphTagAndDoINeedANewLine == true) {
				markdownLines.push( '' );
			}
		}

		let bruh = htmlLine.match( /<br>/g )
		if (bruh!=null){
			markdownLines.push( '' );
		}
	}

	// remove any duplicate empty lines but keep at least one
	let previousLine = '';
	markdownLines = markdownLines.filter( (line) => {
		if (line.length > 0 || previousLine.length > 0) {
			previousLine = line;
			return true;
		}
		return false;
	});

	return markdownLines.join('\n');
}

function markdownHeading (htmlLine) {
	const matchedHtml = htmlLine.match( /^<h(\d)>(.+)<\/h\d>$/ );

	if ( matchedHtml != null ) {
		const headingLevel = matchedHtml[ 1 ];
		const headingText = matchedHtml[ 2 ].trim();
		const markdownHeading = '#'.repeat( headingLevel );

		return [`${markdownHeading} ${headingText}`, true];
	}
	return [htmlLine, false];
}

function markdownUnorderedList (htmlLine,nextLines) {
	/*let previousLine = '';
	if (previousLines.length>0){
		previousLine = previousLines[previousLines.length-1];
	}

	let nextLine = '';
	if (nextLines.length>0){
		nextLine = nextLines[0];
	}*/

	const match = htmlLine.match(/^<li>(.+)<\/li>$/);
	if (match != null){
		let listText = match[1];

		if (whatTypeOfListAreWeCurrentlyOn == 'ul'){
			let markdownLine = `* ${listText}`;
			return [markdownLine,true];
		}

		/*if (previousLine.length <= 0) {
			htmlLine = `<ul>\n${markdownLine}`;
		}
		if (nextLine.length <= 0) {
			htmlLine = `${markdownLine}\n</ul>`;
		}*/

	}

	return [htmlLine,false];




	// let markdownLines = [];
	// if (htmlLine.match(/^<ul>$/)){
	// 	for (let i = 0; i < nextLines.length; i++) {
	// 		let nextLine = nextLines[i];

	// 		if (nextLine.match(/^<\/ul>$/)){
	// 			break;
	// 		}

	// 		if (nextLine.match(/^<li>(.+)<\/li>$/)){
	// 			let listItem = nextLine.match(/^<li>(.+)<\/li>$/)[1];
	// 			markdownLines.push(`* ${listItem}`);
	// 		}
	// 	}
	// 	return [markdownLines, true];
	// }	
	// return [markdownLines, false];
}

function markdownOrderedList (htmlLine, nextLines) {
	/*let previousLine = '';
	if (previousLines.length>0){
		previousLine = previousLines[previousLines.length-1];
	}

	let nextLine = '';
	if (nextLines.length>0){
		nextLine = nextLines[0];
	}*/

	const match = htmlLine.match(/^<li>(.+)<\/li>$/);
	if (match != null){
		let listText = match[1];

		if (whatTypeOfListAreWeCurrentlyOn == 'ol'){
			let markdownLine = `1. ${listText}`;
			return [markdownLine,true];
		}

		/*if (previousLine.length <= 0) {
			htmlLine = `<ul>\n${markdownLine}`;
		}
		if (nextLine.length <= 0) {
			htmlLine = `${markdownLine}\n</ul>`;
		}*/
	}

	return [htmlLine,false];




	// let markdownLines = [];
	// if (htmlLine.match(/^<ol>$/)){
	// 	for (let i = 0; i < nextLines.length; i++) {
	// 		let nextLine = nextLines[i];

	// 		if (nextLine.match(/^<\/ol>$/)){
	// 			break;
	// 		}

	// 		if (nextLine.match(/^<li>(.+)<\/li>$/)){
	// 			let listItem = nextLine.match(/^<li>(.+)<\/li>$/)[1];
	// 			markdownLines.push(`${i+1}. ${listItem}`);
	// 		}
	// 	}
	// 	return [markdownLines, true];
	// }	
	// return [markdownLines, false];

}