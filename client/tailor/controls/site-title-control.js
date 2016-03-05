/**
 * External dependencies
 */
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

/**
 * Internal dependencies
 */
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';

function changeSiteTitle( doc, newText ) {
	const element = doc.querySelector( '.site-title a' );
	if ( ! element ) {
		return;
	}
	element.innerHTML = newText;
}

function changeDescription( doc, newText ) {
	const element = doc.querySelector( '.site-description' );
	if ( ! element ) {
		return;
	}
	element.innerHTML = newText;
}

const SiteTitleControl = React.createClass( {
	propTypes: {
		id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		previewDoc: React.PropTypes.object,
		previewState: React.PropTypes.object.isRequired,
		changePreviewState: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		const newProps = mapStateToProps( this.props.previewState );
		return {
			blogname: newProps.blogname,
			description: newProps.description,
			siteId: newProps.siteId,
		};
	},

	onChangeSiteTitle( event ) {
		const blogname = event.target.value;
		this.setState( { blogname } );
		if ( this.props.previewDoc ) {
			changeSiteTitle( this.props.previewDoc, blogname );
		}
		const newState = cloneDeep( this.props.previewState );
		newState.sites.items[ this.state.siteId ].title = blogname;
		this.props.changePreviewState( newState );
	},

	onChangeDescription( event ) {
		const description = event.target.value;
		this.setState( { description } );
		if ( this.props.previewDoc ) {
			changeDescription( this.props.previewDoc, description );
		}
		const newState = cloneDeep( this.props.previewState );
		newState.sites.items[ this.state.siteId ].description = description;
		this.props.changePreviewState( newState );
	},

	render() {
		return (
			<div className="tailor-controls__site-title-control">
				<FormFieldset>
					<FormLabel htmlFor="blogname">{ this.translate( 'Site Title' ) }</FormLabel>
					<FormTextInput id="blogname" name="blogname" value={ this.state.blogname } onChange={ this.onChangeSiteTitle } />
				</FormFieldset>
				<FormFieldset>
					<FormLabel htmlFor="description">{ this.translate( 'Tagline' ) }</FormLabel>
					<FormTextInput id="description" name="description" value={ this.state.description } onChange={ this.onChangeDescription } />
				</FormFieldset>
			</div>
		);
	}
} );

function mapStateToProps( state ) {
	const { ui, sites } = state;
	const selectedSite = sites.items[ ui.selectedSiteId ];
	if ( ! selectedSite ) {
		return { blogname: '', description: '' };
	}
	return { blogname: selectedSite.title, description: selectedSite.description, siteId: ui.selectedSiteId };
}

export default SiteTitleControl;
