/**
 * External dependencies
 */
import assign from 'lodash/assign';

/**
 * Internal dependencies
 */
import * as ActionTypes from 'state/action-types';

const initialState = {
	previewMarkup: '',
	previewState: null,
};

export default function( state = initialState, action ) {
	switch ( action.type ) {
		case ActionTypes.TAILOR_MARKUP_RECEIVE:
			return assign( {}, state, { previewMarkup: action.markup } );
		case ActionTypes.TAILOR_STATE_CHANGE:
			return assign( {}, state, { previewState: action.previewState } );
	}
	return state;
}
