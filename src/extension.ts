/*
Zigil Finder for Visual Studio Code
by Reza Arani-Kashani
License: MIT
---------------------------------------------------------------------------------------------------
this extension finds the string literals that are hard coded using single and double qoutation 
marks "zigil"s and highlights them so you can easily replace them in your app with your I18N engine output.
---------------------------------------------------------------------------------------------------
*/
import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Zigil Finder Started!');
	const zigilDecorationType = vscode.window.createTextEditorDecorationType({
		borderWidth: '1px',
		borderStyle: 'solid',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
		light: {    //settings for light themes
			backgroundColor: 'rgba(249, 108, 108, 1)',
			borderColor: 'darkblue',
			overviewRulerColor: 'rgba(249, 108, 108, 1)',
		},
		dark: {     //settings for dark themes
			backgroundColor: 'rgba(117, 8, 181, 1)',
			borderColor: 'rgba(181, 8, 8, 1)',
			overviewRulerColor: 'rgba(117, 8, 181, 1)',
		}
	});
	//status bar item for showing number of zigils
    const statusBarInfo = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
    );
    var zigilCounter=0;		//zigil counter for showing in the status bar
    statusBarInfo.show();
    
	let activeEditor = vscode.window.activeTextEditor;  
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);
//--------- timeout implemention
	var timeout = null;
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, 600);
	}
//------------------------------
	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const regEx = /(['"])(?:(?!(?:\\|\1)).|\\.)*\1/g;   //string literals using single and double qoutation mark
		const text = activeEditor.document.getText();
		const zigils: vscode.DecorationOptions[] = [];
		let match;
		while (match = regEx.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'zigil **' + match[0] + '**' };   //hovering message
			zigils.push(decoration);     
		}
		activeEditor.setDecorations(zigilDecorationType, zigils);
        statusBarInfo.text= `Zigils: ${zigils.length}`; //show number of found zigils in the status bar       
	}
}
