/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import FormButton from 'components/forms/form-button';
import FormSettings from './settings';
import Navigation from './navigation';
import FieldList from './field-list';
import { getCurrentUser } from 'state/current-user/selectors';
import PostEditStore from 'lib/posts/post-edit-store';

const ContactFormDialog = React.createClass( {
	displayName: 'ContactFormDialog',

	propTypes: {
		activeTab: PropTypes.oneOf( [ 'fields', 'settings' ] ).isRequired,
		showDialog: PropTypes.bool.isRequired,
		isEdit: PropTypes.bool.isRequired,
		contactForm: PropTypes.shape( {
			to: PropTypes.string,
			subject: PropTypes.string,
			fields: PropTypes.array.isRequired
		} ).isRequired,
		onInsert: PropTypes.func.isRequired,
		onChangeTabs: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
		onFieldAdd: PropTypes.func.isRequired,
		onFieldRemove: PropTypes.func.isRequired,
		onFieldUpdate: PropTypes.func.isRequired,
		onSettingsUpdate: PropTypes.func.isRequired
	},

	getActionButtons() {
		const actionButtons = [
			<FormButton
				key="save"
				onClick={ this.props.onInsert } >
				{ this.props.isEdit ? this.translate( 'Update' ) : this.translate( 'Insert' ) }
			</FormButton>,
			<FormButton
				key="cancel"
				isPrimary={ false }
				onClick={ this.props.onClose } >
				{ this.translate( 'Cancel' ) }
			</FormButton>
		];

		if ( this.props.activeTab === 'fields' ) {
			return [
				<div className="editor-contact-form-modal__secondary-actions">
					<FormButton
						key="add"
						isPrimary={ false }
						onClick={ this.props.onFieldAdd } >
						{ this.translate( 'Add New Field' ) }
					</FormButton>
				</div>,
				...actionButtons
			];
		}

		return actionButtons;
	},

	render() {
		const {
			activeTab,
			currentUser: { email },
			post: { title, type: postType },
			contactForm: { to, subject, fields },
			onChangeTabs,
			onFieldAdd,
			onFieldUpdate,
			onFieldRemove,
			onSettingsUpdate
		} = this.props;

		const content = this.props.activeTab === 'fields'
			? <FieldList { ...{ fields, onFieldAdd, onFieldRemove, onFieldUpdate } } />
			: <FormSettings { ...{ to, subject, email, title, postType, onUpdate: onSettingsUpdate } } />;

		return (
			<Dialog
				isVisible={ this.props.showDialog }
				onClose={ this.props.onClose }
				buttons={ this.getActionButtons() }
				additionalClassNames="editor-contact-form-modal" >
				<Navigation { ...{ activeTab, onChangeTabs, fieldCount: fields.length } } />
				{ content }
			</Dialog>
		);
	}
} );

export default connect( state => {
	return {
		post: PostEditStore.get() || {},
		currentUser: getCurrentUser( state ),
		contactForm: state.ui.editor.contactForm
	};
} )( ContactFormDialog );
