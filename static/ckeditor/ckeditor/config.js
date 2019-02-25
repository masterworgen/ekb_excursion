/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    config.stylesSet = 'empty';
    config.image_prefillDimensions = false;
    config.format_tags = 'p;h1;address';
    config.format_h1 = { element: 'h3', attributes: {  } };
    config.format_p = { element: 'p', attributes: {  } };
};
