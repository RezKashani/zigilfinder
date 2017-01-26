/*
 * Zigil Finder for Visual Studio Code
 * by Reza Arani-Kashani
 * License: MIT
 * 
 * this extension finds the string literals that are hard coded using single 
 * and double quotation marks "zigil"s and highlights them so you can easily
 * replace them in your app with your I18N engine output.
 */

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

	import * as vscode from 'vscode';

//
// ─── STYLES ─────────────────────────────────────────────────────────────────────
//

	const zigilDecorationType = vscode.window.createTextEditorDecorationType({
		borderWidth: '1px',
		borderStyle: 'solid',
		overviewRulerLane: vscode.OverviewRulerLane.Right,

		//
		// ─── LIGHT THEME ─────────────────────────────────────────────────
		//

			light: {
				backgroundColor: 'rgba(249, 108, 108, 1)',
				borderColor: 'darkblue',
				overviewRulerColor: 'rgba(249, 108, 108, 1)',
			},
		
		//
		// ─── DARK THEME ──────────────────────────────────────────────────
		//

			dark: {
				backgroundColor: 'rgba(117, 8, 181, 1)',
				borderColor: 'rgba(181, 8, 8, 1)',
				overviewRulerColor: 'rgba(117, 8, 181, 1)',
			}

		// ─────────────────────────────────────────────────────────────────

	});

//
// ─── ACTIVATOR ──────────────────────────────────────────────────────────────────
//

	export function activate ( context: vscode.ExtensionContext ) {

		// @kary: it's really lame having this in the extension you know...
		// vscode.window.showInformationMessage( 'Zigil Finder Started!' );

		//
		// ─── STATUS BAR INFO ─────────────────────────────────────────────
		//

			// status bar item for showing number of zigils
			const statusBarInfo = vscode.window.createStatusBarItem(
				vscode.StatusBarAlignment.Right,
			)

			// zigil counter for showing in the status bar
			var zigilCounter = 0;
			statusBarInfo.show( );
		
		//
		// ─── EVENT HANDLERS ──────────────────────────────────────────────
		//

			let activeEditor = vscode.window.activeTextEditor;  
			if ( activeEditor )
				triggerUpdateDecorations( );


			// ON DID CHANGE ACTIVE TEXT EDITOR
			const onDidChangeActiveTextEditorUpdater =  editor => {
				activeEditor = editor;
				if ( editor )
					triggerUpdateDecorations( );
			}

			vscode.window.onDidChangeActiveTextEditor(
				onDidChangeActiveTextEditorUpdater , null, context.subscriptions);


			// ON DID CHANGE TEXT DOCUMENT
			const onDidChangeTextDocumentUpdater = event => {
				if ( activeEditor && event.document === activeEditor.document )
					triggerUpdateDecorations( );
			}
			vscode.workspace.onDidChangeTextDocument(
				onDidChangeTextDocumentUpdater, null, context.subscriptions);

		//
		// ─── TIMEOUT IMPLEMENTATION ──────────────────────────────────────
		//

			let timeout = null;
			function triggerUpdateDecorations( ) {
				if ( timeout ) {
					clearTimeout( timeout );
				}
				timeout = setTimeout( updateDecorations, 600 );
			}

		//
		// ─── DECORATION UPDATER ──────────────────────────────────────────
		//

			function updateDecorations ( ) {
				if ( !activeEditor ) return;

				// string literals using single and double quotation mark
				const regEx = /(['"])(?:(?!(?:\\|\1)).|\\.)*\1/g;   
				const text = activeEditor.document.getText();
				const zigils: vscode.DecorationOptions[] = [];
				let match;

				while ( match = regEx.exec( text ) ) {
					const startPos = activeEditor.document.positionAt( match.index );
					const endPos = activeEditor.document.positionAt( match.index + match[ 0 ].length );
					const decoration = {
						range: new vscode.Range( startPos, endPos ), hoverMessage: 'zigil **' + match[ 0 ] + '**'
					}
					zigils.push( decoration );     
				}
				activeEditor.setDecorations( zigilDecorationType, zigils );
				statusBarInfo.text= `Zigils: ${ zigils.length }`; //show number of found zigils in the status bar       
			}

		// ─────────────────────────────────────────────────────────────────

	}

// ────────────────────────────────────────────────────────────────────────────────
