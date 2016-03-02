/**
 * External dependencies
 */
var React = require( 'react' ),
	classNames = require( 'classnames' );

/**
 * Internal dependencies
 */
var toggle = require( '../mixin-toggle' ),
	Geochart = require( '../geochart' ),
	StatsList = require( '../stats-list' ),
	observe = require( 'lib/mixins/data-observe' ),
	skeleton = require( '../mixin-skeleton' ),
	DownloadCsv = require( '../stats-download-csv' ),
	DatePicker = require( '../stats-date-picker' ),
	ErrorPanel = require( '../stats-error' ),
	Card = require( 'components/card' ),
	StatsModulePlaceholder = require( '../stats-module/placeholder' ),
	StatsListLegend = require( '../stats-list/legend' ),
	Gridicon = require( 'components/gridicon' ),
	SectionHeader = require( 'components/section-header' ),
	Button = require( 'components/button' );

module.exports = React.createClass( {
	displayName: 'StatCountries',

	mixins: [ toggle( 'Countries' ), skeleton( 'data' ), observe( 'dataList' ) ],

	data: function( nextProps ) {
		var props = nextProps || this.props;

		return props.dataList.response.data;
	},

	getInitialState: function() {
		return { noData: this.props.dataList.isEmpty() };
	},

	componentWillReceiveProps: function( nextProps ) {
		this.setState( { noData: nextProps.dataList.isEmpty() } );
	},

	getModuleLabel: function() {
		if( ! this.props.summary ) {
			return this.translate( 'Countries' );
		} else {
			return ( <DatePicker period={ this.props.period.period } date={ this.props.period.startOf } summary={ true } /> );
		}
	},

	render: function() {
		var countries,
			mapData = [
				[
					this.translate( 'Country' ).toString(),
					this.translate( 'Views' ).toString()
				]
			],
			data = this.data(),
			hasError = this.props.dataList.isError(),
			noData = this.props.dataList.isEmpty(),
			infoIcon = this.state.showInfo ? 'info' : 'info-outline',
			isLoading = this.props.dataList.isLoading(),
			moduleHeaderTitle,
			summaryPageLink,
			geochart,
			moduleToggle,
			classes;

		classes = [
			'stats-module',
			'is-countries',
			{
				'is-expanded': this.state.showModule,
				summary: this.props.summary,
				'is-loading': isLoading,
				'is-showing-info': this.state.showInfo,
				'has-no-data': noData,
				'is-showing-error': hasError || noData
			}
		];

		// Loop countries and build array for geochart
		data.forEach( function( country ) {
			mapData.push( [ country.label, country.value ] );
		} );

		summaryPageLink = '/stats/' + this.props.period.period + '/countryviews/' + this.props.site.slug + '?startDate=' + this.props.date;

		geochart = <Geochart data={ mapData } dataList={ this.props.dataList } />;

		countries = <StatsList moduleName={ this.props.path } data={ data } />;

		return (
			<div>
				<SectionHeader label={ this.getModuleLabel() }>
					{ ! this.props.summary
					 	? ( <Button
								compact
								borderless
								href={ summaryPageLink }
								>
								<Gridicon icon="stats-alt" />
							</Button> )
					 	: ( <DownloadCsv period={ this.props.period } path={ this.props.path } site={ this.props.site } dataList={ this.props.dataList } /> ) }
				</SectionHeader>
					<Card className={ classNames.apply( null, classes ) }>
						<div className="countryviews">
							<div className="module-content">
								<div className="module-content-text module-content-text-info">
									<p>{ this.translate( 'Explore the list to see which countries and regions generate the most traffic to your site.' ) }</p>
									<ul className="documentation">
										<li><a href="http://en.support.wordpress.com/stats/#views-by-country" target="_blank"><Gridicon icon="info-outline" /> { this.translate( 'About Countries' ) }</a></li>
									</ul>
								</div>
								{ ( noData && ! hasError ) ? <ErrorPanel className="is-empty-message" message={ this.translate( 'No countries recorded' ) } /> : null }

								{ geochart }
								<StatsModulePlaceholder className="is-block" isLoading={ isLoading } />
								<StatsListLegend value={ this.translate( 'Views' ) } label={ this.translate( 'Country' ) } />
								<StatsModulePlaceholder isLoading={ isLoading } />
								{ countries }
								{ hasError ? <ErrorPanel className={ 'network-error' } /> : null }
							</div>
						</div>
					</Card>
			</div>
		);
	}
} );
