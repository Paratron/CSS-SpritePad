<!DOCTYPE html>
<html lang="de">
<head>
    <title>SpritePad</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <script>
        window.Modernizr=function(a,b,c){function y(a,b){return!!~(""+a).indexOf(b)}function x(a,b){return typeof a===b}function w(a,b){return v(m.join(a+";")+(b||""))}function v(a){j.cssText=a}var d="2.0.6",e={},f=b.documentElement,g=b.head||b.getElementsByTagName("head")[0],h="modernizr",i=b.createElement(h),j=i.style,k,l=Object.prototype.toString,m=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),n={},o={},p={},q=[],r=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=x(e[d],"function"),x(e[d],c)||(e[d]=c),e.removeAttribute(d))),e=null;return f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),s,t={}.hasOwnProperty,u;!x(t,c)&&!x(t.call,c)?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],c)},n.flexbox=function(){function c(a,b,c,d){a.style.cssText=m.join(b+":"+c+";")+(d||"")}function a(a,b,c,d){b+=":",a.style.cssText=(b+m.join(c+";"+b)).slice(0,-b.length)+(d||"")}var d=b.createElement("div"),e=b.createElement("div");a(d,"display","box","width:42px;padding:0;"),c(e,"box-flex","1","width:10px;"),d.appendChild(e),f.appendChild(d);var g=e.offsetWidth===42;d.removeChild(e),f.removeChild(d);return g},n.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},n.draganddrop=function(){return r("dragstart")&&r("drop")};for(var z in n)u(n,z)&&(s=z.toLowerCase(),e[s]=n[z](),q.push((e[s]?"":"no-")+s));v(""),i=k=null,e._version=d,e._prefixes=m,e.hasEvent=r;return e}(this,this.document);
        var m = Modernizr;
        var support = m.canvas && m.draganddrop && m.flexbox && (typeof FileReader !== 'undefined');
        if(!support) location.href = 'upgrade.html';
    </script>
    <link rel="shortcut icon" href="favicon.ico" />
    <link href="lib/css/bootstrap.min.css" type="text/css" rel="stylesheet" media="screen">
    <link href="lib/css/main.css?<?=filemtime('lib/css/main.css')?>" type="text/css" rel="stylesheet" media="screen">
    <meta property="og:title" content="SpritePad"/>
    <meta property="og:type" content="product"/>
    <meta property="og:image" content="http://wearekiss.com/lab/spritepad/lib/img/fb-icon.png"/>
    <meta property="og:site_name" content="KISS - Simply Achieve More"/>
    <meta property="fb:admins" content="100000549523060,617757437"/>
    <meta property="og:description" content="SpritePad is a HTML5 Web App that helps you building CSS Spritemaps easy and fast. Give it a try!"/>
</head>
<body>
<div class="topbar" data-scrollspy="scrollspy" >
      <div class="topbar-inner">
        <div class="container">
            <h3><a href="http://wearekiss.com/lab/spritepad/" id="logo" onclick="return false;">SpritePad</a></h3>
          <ul class="nav">
            <li><a href="#" id="new_document" ><img src="lib/img/new.png"title="New SpritePad"> New Spritemap</a></li>
            <li><a href="#" id="download_document" class="disabled"><img src="lib/img/download.png" title="Download Spritemap Data"> Download Spritemap Data</a></li>
            <li><a href="#" id="btn-autoscale" class="disabled"><img src="lib/img/autoscale.png" title="Shrink document to fit elements"> Shrink document to fit elements</a></li>
            <li class="dropdown" data-dropdown="dropdown">
                <a href="#" class="dropdown-toggle"><img src="lib/img/settings.png" title="Settings"> Settings</a>
                <ul class="dropdown-menu" id="settings">
                    <li><label><input checked type="checkbox" data-option="magnetic"> Magnetic elements and guides</label></li>
                    <li><label><input checked type="checkbox" data-option="magnetspace"> Preserve 1px spaces</label></li>
                    <li><label><input type="checkbox" data-option="gridsnap"> Snap elements to grid</label></li>
                    <li><label><input type="checkbox" data-option="drawbounding"> Draw bounding masks</label></li>
                </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
<div id="app">
    <div id="toolbox" class="modal">
        <div class="modal-header">
            <a href="#" class="close" title="Minimize">_</a>
            <h3><img src="lib/img/toolbox.png"><span> Selection Toolbox</span></h3>
        </div>
        <div class="modal-body">
            <a class="btn single toggleable" data-toggle="expand" data-action="expand-and-repeat" href="#" title="Expand and repeat horizontally"><img src="lib/img/expand.png"></a>
        </div>
    </div>
    <div id="document">
            <div id="excanvas" style="display: none;">
                <div id="canvas" style="display: none;"></div>
                <span id="scale"></span>
                <span id="sdisplay"><b>320x240</b></span>
                <span id="context">
                    
                </span>
            </div>
    </div>
    <div id="sidebar">
        <div class="styles"></div>
    </div>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="lib/js/LAB.min.js"></script>
<script src="lib/js/app.js"></script>
<script>
    app.init();
</script>

<!-- Piwik -->
<script type="text/javascript">
var pkBaseURL = (("https:" == document.location.protocol) ? "https://analytics.wearekiss.de/" : "http://analytics.wearekiss.de/");
document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
</script><script type="text/javascript">
try {
var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 7);
piwikTracker.trackPageView();
piwikTracker.enableLinkTracking();
} catch( err ) {}
</script><noscript><p><img src="http://analytics.wearekiss.de/piwik.php?idsite=7" style="border:0" alt="" /></p></noscript>
<!-- End Piwik Tracking Code -->
</body>
</html>