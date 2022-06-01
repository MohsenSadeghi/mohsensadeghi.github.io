function FrameResize() {
	var PageWidth;
	var PageHeight;
	
	PageWidth = window.innerWidth;
	PageHeight = window.innerHeight;

	var F1 = parent.document.getElementById('MenuFrame');
	var F2 = parent.document.getElementById('PageContent');
	
	F1.style.position = 'fixed';
	F1.style.top = '10px';
	F1.style.left = '10px';
	F1.style.width = '250px';
	F1.style.height = PageHeight - 20 + 'px';
	
	F2.style.position = 'absolute';
	F2.style.top = '0px';
	F2.style.left = '270px';
	
	F1.style.visibility = 'visible';
	F2.style.visibility = 'visible';
}

window.onresize = function(event) { FrameResize(); };
