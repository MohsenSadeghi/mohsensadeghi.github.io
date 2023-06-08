function FrameResize() {

	var menu_div = parent.document.getElementById('MenuFrame');
	var page_div = parent.document.getElementsByClassName('PageContent')[0];
	var masthead_div = parent.document.getElementById('Masthead');
	
	menu_div.style.position = 'fixed';
	menu_div.style.top = '10px';
	menu_div.style.left = '10px';
	menu_div.style.width = '250px';
	menu_div.style.height = window.innerHeight - 20 + 'px';
	
	page_div.style.position = 'absolute';
	page_div.style.top = '0px';
	page_div.style.left = '270px';
	page_div.style.right = '10px';
	//page_div.style.bottom = '10px';
	
	if (masthead_div)
	{
	    var masthead_photo = parent.document.getElementById('Masthead_Photo');
	    var masthead_name = parent.document.getElementById('Masthead_Name');
        
        var photo_aspect_ratio = masthead_photo.naturalWidth / masthead_photo.naturalHeight;
        var name_aspect_ratio = masthead_name.naturalWidth / masthead_name.naturalHeight;
        
        var max_width = window.innerWidth - 295;
        var best_width = Math.min(max_width, 1200);
        
    	masthead_photo.width = best_width;
    	masthead_photo.height = best_width / photo_aspect_ratio;
        
        if (max_width < 80 * name_aspect_ratio)
        {  	
       	    masthead_name.width = max_width;
       	    masthead_name.height = max_width / name_aspect_ratio;
       	}
	}

	if (page_div.offsetHeight < window.innerHeight - 20)
	{
		page_div.style.height = window.innerHeight - 20 + 'px';
	}
	
	menu_div.style.visibility = 'visible';
	page_div.style.visibility = 'visible';
}

window.onresize = function(event) { FrameResize(); };
