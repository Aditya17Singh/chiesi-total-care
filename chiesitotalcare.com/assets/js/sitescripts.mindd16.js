$(function(n){var i,r,t;i=jQuery;r=window;i.fn.inViewport=function(n){return this.each(function(t,u){function f(){var r=i(this).height(),t=u.getBoundingClientRect(),f=t.top,t=t.bottom;return n.call(u,Math.max(0,0<f?r-f:t<r?t:r))}f();i(r).on("resize scroll",f)})};n(".animate").inViewport(function(t){t?n(this).addClass("trigger-animation"):n(this).removeClass("trigger-animation")});n("main section").length&&(t={},n("main section").inViewport(function(i){i&&n(this).attr("id")&&(t[n(this).attr("id")]=i)}),n(window).scroll(function(){clearTimeout(n.data(this,"scrollTimer"));n.data(this,"scrollTimer",setTimeout(function(){var u,r=[],i;for(u in t)r.push([u,t[u]]);r.sort(function(n,t){return t[1]-n[1]});i=!1;n(window).scrollTop()+n(window).height()==n(document).height()&&(i=!0);history.replaceState&&r.length&&(i?(i=n("main section:last-of-type").attr("id"),history.replaceState(null,null,"#"+i),n("header .navbar-collapse .nav-link").removeClass("active"),n('header .navbar-collapse .nav-link[href="#'+i+'"]').addClass("active")):(history.replaceState(null,null,"#"+r[0][0]),n("header .navbar-collapse .nav-link").removeClass("active"),n('header .navbar-collapse .nav-link[href="#'+r[0][0]+'"]').addClass("active")));t={}},100))}));n("header .navbar-collapse .nav-link").click(function(){var u;jQuery(".navbar-toggler").removeClass("active");var t=null,i=n(this).index(),r=n("header .navbar-collapse .nav-link").length-1,f=r-i;return n("header .navbar-collapse").hasClass("show")?(t=n("header").height()-n("header .navbar-collapse.show").height(),n("header .navbar-collapse").collapse("hide")):t=n("header").height(),u=n(n(this).attr("href")).offset().top-t,n(document).height()-n(window).height()<u&&0===jQuery("#indication-and-safety").length?i!==r?n("html, body").stop(!0).animate({scrollTop:n(document).height()-n(window).height()-f},1e3):n("html, body").stop(!0).animate({scrollTop:n(document).height()},1e3):n("html, body").stop(!0).animate({scrollTop:n(n(this).attr("href")).offset().top-t},1e3),!1});n("header").length&&n(window).on("load resize scroll",function(){50<=n(window).scrollTop()?n("header").addClass("scrolling"):n("header").removeClass("scrolling")});n("a").each(function(){var t;n(this).attr("href")&&(new RegExp("^http").test(n(this).attr("href"))&&(t=n(this).attr("href").replace(/^(https?):\/\//,""),new RegExp("^"+window.location.hostname).test(t)||(n(this).attr("target","_blank"),n(this).attr("rel","noopener"))),new RegExp(".pdf$").test(n(this).attr("href"))&&n(this).attr("target","_blank"))})})