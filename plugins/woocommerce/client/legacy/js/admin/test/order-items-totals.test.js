/**
 * order-items-totals: Items Subtotal and Cost Total from line items DOM.
 */

const { computeTotalsFromLineItems } = require( '../order-items-totals' );

function createWrapperWithLineItems( rows ) {
	const wrapper = document.createElement( 'div' );
	wrapper.className = 'woocommerce_order_items_wrapper';

	const lineItemsBody = document.createElement( 'tbody' );
	lineItemsBody.id = 'order_line_items';

	rows.forEach( ( row ) => {
		const tr = document.createElement( 'tr' );
		tr.className = 'item';
		if ( row.lineTotal !== undefined ) {
			const td = document.createElement( 'td' );
			td.className = 'line_cost';
			td.setAttribute( 'data-sort-value', String( row.lineTotal ) );
			tr.appendChild( td );
		}
		if ( row.cost !== undefined ) {
			const td = document.createElement( 'td' );
			td.className = 'item_cost_of_goods';
			td.setAttribute( 'data-sort-value', String( row.cost ) );
			tr.appendChild( td );
		}
		lineItemsBody.appendChild( tr );
	} );

	const table = document.createElement( 'table' );
	table.appendChild( lineItemsBody );
	wrapper.appendChild( table );

	// Totals section.
	const totalsDiv = document.createElement( 'div' );
	totalsDiv.className = 'wc-order-totals-items';
	const totalsTable = document.createElement( 'table' );
	totalsTable.className = 'wc-order-totals';
	const totalsFirstRow = document.createElement( 'tr' );
	const tdLabel = document.createElement( 'td' );
	tdLabel.className = 'label';
	tdLabel.textContent = 'Items Subtotal:';
	const tdEmpty = document.createElement( 'td' );
	const tdTotal = document.createElement( 'td' );
	tdTotal.className = 'total';
	tdTotal.textContent = '0';
	totalsFirstRow.appendChild( tdLabel );
	totalsFirstRow.appendChild( tdEmpty );
	totalsFirstRow.appendChild( tdTotal );
	totalsTable.appendChild( totalsFirstRow );
	totalsDiv.appendChild( totalsTable );
	wrapper.appendChild( totalsDiv );

	return wrapper;
}

describe( 'order-items-totals - computeTotalsFromLineItems', () => {
	test( 'returns zeros when wrapper is null or undefined', () => {
		expect( computeTotalsFromLineItems( null ) ).toEqual( {
			itemsSubtotal: 0,
			costTotal: 0,
		} );
		expect( computeTotalsFromLineItems( undefined ) ).toEqual( {
			itemsSubtotal: 0,
			costTotal: 0,
		} );
	} );

	test( 'returns zeros when wrapper has no #order_line_items', () => {
		const wrapper = document.createElement( 'div' );
		wrapper.className = 'woocommerce_order_items_wrapper';
		expect( computeTotalsFromLineItems( wrapper ) ).toEqual( {
			itemsSubtotal: 0,
			costTotal: 0,
		} );
	} );

	test( 'sums line totals from tr.item td.line_cost data-sort-value', () => {
		const wrapper = createWrapperWithLineItems( [
			{ lineTotal: 10.5, cost: 2 },
			{ lineTotal: 25, cost: 5 },
			{ lineTotal: 0, cost: 0 },
		] );
		const result = computeTotalsFromLineItems( wrapper );
		expect( result.itemsSubtotal ).toBe( 35.5 );
		expect( result.costTotal ).toBe( 7 );
	} );

	test( 'sums cost total from tr.item td.item_cost_of_goods when present', () => {
		const wrapper = createWrapperWithLineItems( [
			{ lineTotal: 100, cost: 12.34 },
			{ lineTotal: 50, cost: 5.66 },
		] );
		const result = computeTotalsFromLineItems( wrapper );
		expect( result.itemsSubtotal ).toBe( 150 );
		expect( result.costTotal ).toBe( 18 );
	} );

	test( 'ignores invalid or missing data-sort-value (treats as 0)', () => {
		const wrapper = createWrapperWithLineItems( [
			{ lineTotal: 10, cost: 1 },
		] );
		const lineItemsBody = wrapper.querySelector( '#order_line_items' );
		const row = lineItemsBody.querySelector( 'tr.item' );
		const costCell = row.querySelector( 'td.item_cost_of_goods' );
		costCell.setAttribute( 'data-sort-value', 'not-a-number' );

		const result = computeTotalsFromLineItems( wrapper );
		expect( result.itemsSubtotal ).toBe( 10 );
		expect( result.costTotal ).toBe( 0 );
	} );

	test( 'handles empty line items (no rows)', () => {
		const wrapper = createWrapperWithLineItems( [] );
		const result = computeTotalsFromLineItems( wrapper );
		expect( result.itemsSubtotal ).toBe( 0 );
		expect( result.costTotal ).toBe( 0 );
	} );

	test( 'handles rows with only line_total (no cost column)', () => {
		const wrapper = createWrapperWithLineItems( [
			{ lineTotal: 99.99 },
		] );
		const result = computeTotalsFromLineItems( wrapper );
		expect( result.itemsSubtotal ).toBe( 99.99 );
		expect( result.costTotal ).toBe( 0 );
	} );

	test( 'sums multiple line items to items subtotal and cost total', () => {
		const wrapper = createWrapperWithLineItems( [
			{ lineTotal: 29.99, cost: 0.25 },
			{ lineTotal: 15.5, cost: 1.5 },
			{ lineTotal: 100, cost: 10 },
		] );
		const result = computeTotalsFromLineItems( wrapper );
		expect( result.itemsSubtotal ).toBe( 145.49 );
		expect( result.costTotal ).toBe( 11.75 );
	} );
} );
