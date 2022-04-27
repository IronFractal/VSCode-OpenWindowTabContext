"use strict";

import * as vscode from "vscode";
import fs = require("fs");
import path = require("path");

var cache: { [bin: string]: string; } = {};

export function getCodeCommandPath() {
  	var exec: unknown = vscode.workspace.getConfiguration().get("owtc.command");
	var command = correctCommandName(typeof exec === "string" ? String(exec) : "code");
	if (cache[command]) {
		return cache[command];
	}

	let code_path: string[] = [];
	// candidate 1
	code_path.push(path.join(path.dirname(process.execPath), "bin", command));
	// candidate 2
	code_path.push(path.join(process.cwd(), command));
	// candidate 3
	code_path.push(path.join(process.cwd(), "bin", command));

	console.log(code_path);

	for (const bin_path of code_path) {
		if (fs.existsSync(bin_path)) {
			console.log(bin_path);
			cache[command] = bin_path;
			return bin_path;
		}	
	}

	return null;
}

export function isCodeCommandAvailable(): boolean {
	return getCodeCommandPath() !== null;
}

function correctCommandName(bin_name: string) {
	if (process.platform === "win32") {
		return bin_name + ".cmd";
	}
	return bin_name;
}
