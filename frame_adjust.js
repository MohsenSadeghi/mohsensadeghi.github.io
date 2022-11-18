function FrameResize() {
	var PageWidth;
	var PageHeight;
	
	PageWidth = window.innerWidth;
	PageHeight = window.innerHeight;

	var menu_div = parent.document.getElementById('MenuFrame');
	var page_div = parent.document.getElementsByClassName('PageContent')[0];
	
	menu_div.style.position = 'fixed';
	menu_div.style.top = '10px';
	menu_div.style.left = '10px';
	menu_div.style.width = '250px';
	menu_div.style.height = PageHeight - 20 + 'px';
	
	page_div.style.position = 'absolute';
	page_div.style.top = '0px';
	page_div.style.left = '270px';
	page_div.style.right = '10px';
	
	
	if (page_div.offsetHeight < PageHeight - 10)
	{
		page_div.style.height = PageHeight - 10 + 'px';
	}
	
	menu_div.style.visibility = 'visible';
	page_div.style.visibility = 'visible';
}

window.onresize = function(event) { FrameResize(); };
