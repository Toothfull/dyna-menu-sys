//Converts markdown to html
function markdownToHTML(markdownString) {
	let markdownLines = markdownString.split('\n');
	let markdownLinesCount = markdownLines.length;

	let htmlLines = [];

	for (let lineNumber = 0; lineNumber < markdownLinesCount; lineNumber++) {
		//Current line
		let markdownLine = markdownLines[lineNumber];

		if ( markdownLine.length <= 0 ) {
			//htmlLines.push( '<p></p>' );
			htmlLines.push( '<br>' );
			continue;
		};

		//Lines before and after current
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
		markdownLine = markdownLine.replaceAll(/!\[(.*?)\]\((.*?)\)/g, '<img src=\"$2\" alt=\"$1\" width=\"128px\" />'); // Images
		markdownLine = markdownLine.replaceAll(/\[(.*?)\]\((.*?)\)/g, '<a href=\"$2\">$1</a>'); // Links
		markdownLine = markdownLine.replaceAll(/\{(#[0-9A-Fa-f]{6}),(.+?)\}/g, '<span style=\"color: $1;\">$2</span>'); // Colored text

		//Push edited line if it changed
		if (didHeadingChange||didUnorderedListChange||didOrderedListChange) {
			htmlLines.push(markdownLine);
		} else { //Otherwise push as a paragraph
			htmlLines.push(`<p>${markdownLine}</p>`);
		}
	}

	// Remove empty lines
	htmlLines = htmlLines.filter(function(line){
		return line.length>0;
	});

	return htmlLines.join('\n');
}

//Converts markdown heading to html heading
function heading(markdownLine){
	for (let count = 6; count >= 1; count--){
		let prefix = '#'.repeat(count);
		if (markdownLine.startsWith(prefix)) {
			return [`<h${count}>${markdownLine.slice(prefix.length+1)}</h${count}>`,true];
		}
	}

	return [markdownLine, false];
}

//Converts markdown unordered list to html unordered list
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

//Converts markdown ordered list to html ordered list
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

/***********************************************************************************/

// Global variable determining what type of conversion we are currently on
let whatTypeOfListAreWeCurrentlyOn = null

//Converts html to markdown
function HTMLToMarkdown() {
	let htmlLines = $('#menuView').html().split('\n');
	let htmlLinesCount = htmlLines.length;

	let markdownLines = [];

	for (let lineNumber = 0; lineNumber < htmlLinesCount; lineNumber++) {
		let htmlLine = htmlLines[lineNumber];

		htmlLine = htmlLine.replaceAll( /&amp;/g, "&" );

		//Checks for unordered list
		if (htmlLine.match(/<ul>/) != null) {
			markdownLines.push( '' );
			whatTypeOfListAreWeCurrentlyOn = 'ul'
			continue;
		}
		if (htmlLine.match(/<\/ul>/) != null) {
			markdownLines.push( '' );
			whatTypeOfListAreWeCurrentlyOn = null
			continue;
		}
		//Checks for ordered list
		if (htmlLine.match(/<ol>/) != null) {
			markdownLines.push( '' );
			whatTypeOfListAreWeCurrentlyOn = 'ol'
			continue;
		}
		if (htmlLine.match(/<\/ol>/) != null) {
			markdownLines.push( '' );
			whatTypeOfListAreWeCurrentlyOn = null
			continue;
		}

		//Checks for line breaks
		if (htmlLine.match(/^<br>$/) != null) {
			markdownLines.push( '' );
			continue;
		}

		//Removes paragraph tags
		let replacement = htmlLine.replaceAll( /<p>(.*)<\/p>/g, "$1" )
		let wasThereAParagraphTagAndDoINeedANewLine = false
		if (replacement!=htmlLine){
			htmlLine = replacement
			wasThereAParagraphTagAndDoINeedANewLine = true
		}

		//Checks if already converted to a heading
		let didHeadingChange = false;
		[htmlLine, didHeadingChange] = markdownHeading(htmlLine);
		if (didHeadingChange == true) {
			markdownLines.push(htmlLine);
			markdownLines.push( '' );
			continue;
		}

		//Checks if already converted to a list
		let didListChange = false;
		[htmlLine, didListChange] = markdownUnorderedList(htmlLine);
		if (didListChange == true) {
			markdownLines.push(htmlLine);
			continue;
		}

		//Checks if already converted to an ordered list
		let didOrderedListChange = false;
		[htmlLine,didOrderedListChange] = markdownOrderedList(htmlLine);
		if (didOrderedListChange == true) {
			markdownLines.push(htmlLine);
			continue;
		}

		//Checks if converted into a heading/list/order list
		if (didHeadingChange == false || didListChange == false || didOrderedListChange == false) {
			htmlLine = htmlLine.replaceAll( /<strong>(.*?)<\/strong>/g, "**$1**" )
			htmlLine = htmlLine.replaceAll( /<u>(.*?)<\/u>/g, "__$1__" )
			htmlLine = htmlLine.replaceAll( /<em>(.*?)<\/em>/g, "*$1*" )
			htmlLine = htmlLine.replaceAll( /<s>(.*?)<\/s>/g, "~~$1~~" )
			htmlLine = htmlLine.replaceAll( /<a href="(.*)">(.*)<\/a>/g, "[$2]($1)" )
			htmlLine = htmlLine.replaceAll( /<span style="color: (#[0-9A-Fa-f]{6});">(.+?)<\/span>/g, '{$1,$2}' )

			//Push if an empty line
			//if (htmlLine.length > 0) {
				markdownLines.push(htmlLine)
			//}

			//add an empty line if there was a paragraph tag
			if (wasThereAParagraphTagAndDoINeedANewLine == true) {
				//markdownLines.push( '' );
			}
		}
	}

	// remove any duplicate empty lines but keep at least one
	/*let previousLine = '';
	markdownLines = markdownLines.filter( (line) => {
		if (line.length>0||previousLine.length>0) {
			previousLine = line;
			return true;
		}
		return false;
	});*/

	return markdownLines.join('\n');
}

//Converts html heading to markdown heading
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

//Converts html ul to markdown unordered list
function markdownUnorderedList (htmlLine) {
	const match = htmlLine.match(/^<li>(.+)<\/li>$/);
	if (match != null){
		let listText = match[1];

		if (whatTypeOfListAreWeCurrentlyOn == 'ul'){
			let markdownLine = `* ${listText}`;
			return [markdownLine,true];
		}
	}

	return [htmlLine,false];
}

//Converts html ol to markdown ordered list
function markdownOrderedList (htmlLine) {
	const match = htmlLine.match(/^<li>(.+)<\/li>$/);
	if (match != null){
		let listText = match[1];

		if (whatTypeOfListAreWeCurrentlyOn == 'ol'){
			let markdownLine = `1. ${listText}`;
			return [markdownLine,true];
		}
	}

	return [htmlLine,false];
}