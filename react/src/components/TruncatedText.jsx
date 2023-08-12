import React from "react";

function TruncatedText({ text, maxCharacters }) {
	if(text && text.length > maxCharacters) {
		const truncatedText = text.substring(0, maxCharacters) + "...";
		return <span title={text}>{truncatedText}</span>
	}
	return <span>{text}</span>
}

export default TruncatedText;