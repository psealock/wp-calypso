/**
 * Internal dependencies
 */
import { translate } from 'lib/mixins/i18n';
import SiteTitleControl from './site-title-control';

/**
 * These are the sections of the customizer (or "controls", here).
 *
 * Each control must have these properties:
 *
 * id: A unique ID for the control.
 * title: A string to display for the control.
 * componentClass: A React class to use for the control.
 *
 * The class will be turned into a React element when the control is focused and
 * rendered in the controls panel. When it is rendered, it will be provided with
 * the following props:
 *
 * id: The same ID as above.
 * title: The same title as above.
 * previewDoc: The `document` object from the preview frame's DOM.
 * previewState: A copy of the full Redux state, possibly with changes.
 * changePreviewState: A function that can be called to update the previewState.
 *
 * The component can update the preview iframe using `previewDoc`. It can use
 * `previewState` to render itself. It can persist any changes using
 * `changePreviewState`, although those changes are only temporary, not actually
 * saved.
 *
 * When the Save button is clicked, the `saveFunction` method of each control is
 * called, passing it two arguments:
 *
 * 1. An object of all the actions in TailorActions, bound to dispatch.
 * 2. The current `previewState` object.
 *
 * The `saveFunction` is expected to use the actions to persist that control's
 * settings from the state.
 */
const controlConfig = [
	{
		id: 'siteTitle',
		title: translate( 'Site Title, Tagline, and Logo' ),
		componentClass: SiteTitleControl,
		saveFunction: ( actions, state ) => {
			const selectedSite = state.sites.items[ state.ui.selectedSiteId ];
			if ( selectedSite ) {
				actions.setSiteSettings( state.ui.selectedSiteId, { blogname: selectedSite.title, blogdescription: selectedSite.description } );
			}
		}
	}
];

export default controlConfig;
