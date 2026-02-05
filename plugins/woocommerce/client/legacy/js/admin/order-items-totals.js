/**
 * Order items totals calculation from DOM.
 *
 * @param {Element} wrapperElement - The wrapper element containing #order_line_items and totals (e.g. .woocommerce_order_items_wrapper).
 * @return {{ itemsSubtotal: number, costTotal: number }} Summed line totals and cost totals.
 */
function computeTotalsFromLineItems( wrapperElement ) {
	if ( ! wrapperElement ) {
		return { itemsSubtotal: 0, costTotal: 0 };
	}

	const lineItemsBody = wrapperElement.querySelector( '#order_line_items' );
	if ( ! lineItemsBody ) {
		return { itemsSubtotal: 0, costTotal: 0 };
	}

	const rows = lineItemsBody.querySelectorAll( 'tr.item' );
	let itemsSubtotal = 0;
	let costTotal = 0;

	rows.forEach( ( row ) => {
		const lineCostCell = row.querySelector( 'td.line_cost' );
		if ( lineCostCell ) {
			const val = parseFloat( lineCostCell.getAttribute( 'data-sort-value' ) );
			itemsSubtotal += Number.isFinite( val ) ? val : 0;
		}

		const costCell = row.querySelector( 'td.item_cost_of_goods' );
		if ( costCell ) {
			const val = parseFloat( costCell.getAttribute( 'data-sort-value' ) );
			costTotal += Number.isFinite( val ) ? val : 0;
		}
	} );

	return { itemsSubtotal, costTotal };
}

if ( typeof window !== 'undefined' ) {
	window.wcOrderItemsTotalsCompute = computeTotalsFromLineItems;
}

if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = { computeTotalsFromLineItems };
}
