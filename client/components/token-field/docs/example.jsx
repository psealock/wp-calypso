/**
 * External dependencies
 */
var React = require( 'react' ),
	PureRenderMixin = require( 'react-pure-render/mixin' );

/**
 * Internal dependencies
 */
var TokenField = require( 'components/token-field' );

/**
 * Module variables
 */
var suggestions = [
	'the', 'of', 'and', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i', 'you', 'it',
	'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your', 'all', 'have', 'new', 'more', 'an', 'was', 'we',
	'will', 'home', 'can', 'us', 'about', 'if', 'page', 'my', 'has', 'search', 'free', 'but', 'our', 'one',
	'other', 'do', 'no', 'information', 'time', 'they', 'site', 'he', 'up', 'may', 'what', 'which', 'their'
];

var TokenFields = React.createClass( {
	displayName: 'TokenFields',

	mixins: [ PureRenderMixin ],

	getInitialState: function() {
		return {
			tokenSuggestions: suggestions,
			isBorderless: false,
			tokens: Object.freeze( [ 'foo', 'bar' ] ),
			tokensWithStatuses: [
				{
					value: 'Success',
					status: 'success'
				},
				{
					value: 'Error',
					status: 'error'
				},
				{
					value: 'Validating',
					status: 'validating'
				}
			]
		};
	},

	toggleBorderless() {
		this.setState( { isBorderless: ! this.state.isBorderless } );
	},

	render: function() {
		const toggleBorderlessText = this.state.isBorderless ? 'Regular Tokens' : 'Borderless Tokens'
		return (
			<div className="design-assets__group">
				<h2>
					<a href="/devdocs/design/token-fields">Token Field</a>
					<a className="design-assets__toggle button" onClick={ this.toggleBorderless }>{ toggleBorderlessText }</a>
				</h2>

				<p>
					The <code>TokenField</code> is a field similar to the tags and categories
					fields in the interim editor chrome, or the "to" field in Mail on OS X.
					Tokens can be entered by typing them or selecting them from a list of suggested tokens.
				</p>

				<h3>TokenField with Suggestions</h3>

				<TokenField
					isBorderless={ this.state.isBorderless }
					suggestions={ this.state.tokenSuggestions }
					value={ this.state.tokens }
					onChange={ this._onTokensChange } />

				<h3 style={ { marginTop: 20 } }>Disabled TokenField with Token Statuses</h3>
				<TokenField
					disabled
					isBorderless={ this.state.isBorderless }
					value={ this.state.tokensWithStatuses } />
			</div>
		);
	},

	_onTokensChange: function( value ) {
		this.setState( { tokens: value } );
	}
} );

module.exports = TokenFields;
