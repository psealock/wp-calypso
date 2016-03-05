/**
 * External dependencies
 */
import React from 'react';
import debugFactory from 'debug';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';

/**
 * Internal dependencies
 */
import * as TailorActions from './actions';
import SitePreview from 'components/site-preview';
import TailorControls from './tailor-controls';
import controlConfig from './controls/config';

const debug = debugFactory( 'calypso:tailor' );

const LoadingPanel = props => <div className="tailor__loading"><h1>{ props.translate( 'Loading' ) }</h1></div>;

const Tailor = React.createClass( {
	propTypes: {
		actions: React.PropTypes.object.isRequired,
		blogname: React.PropTypes.string.isRequired,
		// The current preview HTML markup
		previewMarkup: React.PropTypes.string,
		// A copy of the current state, overridden by unsaved changes
		previewState: React.PropTypes.object,
	},

	getInitialState() {
		return {
			showingControl: null,
			previewDoc: null,
		};
	},

	componentWillMount() {
		// Clear the temporary state when we first load
		this.props.actions.changePreviewState( null );
		this.props.actions.fetchPreviewMarkup( this.props.sites.selected, '' );
	},

	getMarkup() {
		return this.props.previewMarkup;
	},

	getControlById( id ) {
		const control = controlConfig.reduce( ( found, config ) => {
			if ( config.id === id ) {
				return config.componentClass;
			}
			return found;
		} );
		if ( ! control ) {
			return null;
		}
		return { id, title: control.title, component: this.buildControl( control ) };
	},

	changePreviewState( newState ) {
		this.props.actions.changePreviewState( newState );
	},

	buildControl( config ) {
		const { id, title, componentClass } = config;
		return React.createElement( componentClass, { id, title, previewDoc: this.state.previewDoc, previewState: this.props.previewState, changePreviewState: this.changePreviewState } );
	},

	getControls() {
		return controlConfig.map( config => ( { id: config.id, title: config.title } ) );
	},

	showControl( id ) {
		// TODO: this should be an action
		this.setState( { showingControl: id } );
	},

	onClickBack() {
		// TODO: this should be an action
		// TODO: this should support an array of controls
		this.setState( { showingControl: null } );
	},

	onSave() {
		controlConfig.map( config => config.saveFunction( this.props.actions, this.props.previewState ) );
	},

	onPreviewLoad( doc ) {
		this.setState( { previewDoc: doc } );
	},

	render() {
		debug( 'rendering tailor' );
		if ( ! this.props.previewMarkup ) {
			return (
				<div className="tailor">
					<LoadingPanel translate={ this.translate } />
				</div>
			);
		}
		const showingControl = this.state.showingControl ? this.getControlById( this.state.showingControl ) : null;
		return (
			<div className="tailor">
				<TailorControls
					siteTitle={ this.props.blogname }
					controls={ this.getControls() }
					showControl={ this.showControl }
					showingControl={ showingControl }
					onClickBack={ this.onClickBack }
					onSave={ this.onSave }
				/>
				<SitePreview markup={ this.getMarkup() } onLoad={ this.onPreviewLoad } />
			</div>
		);
	}
} );

function cloneState( state ) {
	// state contains mutable and immutable objects. Here we convert them all to
	// mutable objects to avoid copy errors when cloning.
	const immutableState = fromJS( state );
	return immutableState.toJS();
}

function mapStateToProps( state ) {
	const { tailor } = state;
	// state contains mutable and immutable objects. Here we convert them all to
	// mutable objects to avoid copy errors when cloning.
	const previewState = tailor.previewState || cloneState( state );
	debug( 'previewState newState', previewState );
	const selectedSite = previewState.sites.items[ previewState.ui.selectedSiteId ] || {};
	return { previewMarkup: tailor.previewMarkup, previewState, blogname: selectedSite.title };
}

function mapDispatchToProps( dispatch ) {
	return {
		actions: bindActionCreators( TailorActions, dispatch ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Tailor );
