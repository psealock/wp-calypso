/**
 * External Dependencies
 */
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import omit from 'lodash/omit';
import debugFactory from 'debug';

/**
 * Internal Dependencies
 */
import { ThemeSheet as ThemeSheetComponent } from 'my-sites/themes/sheet';
import ThemeDetailsComponent from 'components/data/theme-details';
import i18n from 'lib/mixins/i18n';
import { getCurrentUser } from 'state/current-user/selectors';
import { getThemeDetails } from 'state/themes/theme-details/selectors';
import { setSection } from 'state/ui/actions';
import ClientSideEffects from 'components/client-side-effects';
import ThemesActionTypes from 'state/themes/action-types';
import wpcom from 'lib/wp';
import config from 'config';
import { decodeEntities } from 'lib/formatting';

const debug = debugFactory( 'calypso:themes' );
let themeDetailsCache = new Map();

export function makeElement( ThemesComponent, Head, store, props ) {
	return(
		<ReduxProvider store={ store }>
			<Head title={ props.title } tier={ props.tier || 'all' }>
				<ThemesComponent { ...omit( props, [ 'title', 'runClientAnalytics' ] ) } />
				<ClientSideEffects>
					{ props.runClientAnalytics }
				</ClientSideEffects>
			</Head>
		</ReduxProvider>
	);
};

export function fetchThemeDetailsData( context, next ) {
	if ( ! config.isEnabled( 'manage/themes/details' ) ) {
		return next();
	}

	function updateRenderCache( themeSlug ) {
		wpcom.undocumented().themeDetails( themeSlug, ( error, data ) => {
			if ( error ) {
				debug( `Error fetching theme ${ themeSlug } details: `, error.message || error );
				return;
			}
			const themeData = themeDetailsCache.get( themeSlug );
			if ( ! themeData || ( Date( data.date_updated ) > Date( themeData.date_updated ) ) ) {
				debug( 'caching', themeSlug );
				themeDetailsCache.set( themeSlug, data );
				// update the render cache
				renderThemeSheet( data );
			}
		} );
	}

	function renderThemeSheet( theme ) {
		context.store.dispatch( {
			type: ThemesActionTypes.RECEIVE_THEME_DETAILS,
			themeId: theme.id,
			themeName: theme.name,
			themeAuthor: theme.author,
			themeScreenshot: theme.screenshot,
			themePrice: theme.price ? theme.price.display : undefined,
			themeDescription: theme.description,
			themeDescriptionLong: theme.description_long,
			themeSupportDocumentation: theme.extended ? theme.extended.support_documentation : undefined,
		} );

		next();
	};

	const themeSlug = context.params.slug;
	const theme = themeDetailsCache.get( themeSlug );
	if ( theme ) {
		Object.assign( context, renderThemeSheet( theme ) );
		debug( 'found theme!', theme.id );
	}

	themeSlug && updateRenderCache( themeSlug ); // TODO(ehg): We don't want to hit the endpoint for every req. Debounce based on theme arg?
}

export function details( context, next ) {
	const { slug, section } = context.params;
	const user = getCurrentUser( context.store.getState() );
	const themeName = ( getThemeDetails( context.store.getState(), slug ) || false ).name;
	const title = i18n.translate( '%(theme)s Theme', {
		args: { theme: themeName },
		textOnly: true
	} );
	const Head = user
		? require( 'layout/head' )
		: require( 'my-sites/themes/head' );
	const props = {
		themeSlug: slug,
		contentSection: section,
		title: decodeEntities( title ) + ' — WordPress.com', // TODO: Use lib/screen-title's buildTitle. Cf. https://github.com/Automattic/wp-calypso/issues/3796
		isLoggedIn: !! user
	};

	context.store.dispatch( setSection( 'themes', {
		hasSidebar: false,
		isFullScreen: true
	} ) );

	//TODO: use makeElement()
	context.primary = (
		<ReduxProvider store={ context.store } >
			<Head title={ props.title }>
				<ThemeDetailsComponent id={ props.themeSlug } section={ props.contentSection } >
					<ThemeSheetComponent />
				</ThemeDetailsComponent>
			</Head>
		</ReduxProvider>
	);
	context.secondary = null; // When we're logged in, we need to remove the sidebar.
	next();
}
