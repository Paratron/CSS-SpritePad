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
    <link href="lib/css/main.css?<?=filemtime('lib/css/main.css')?>" type="text/css" rel="stylesheet" media="screen">
</head>
<body>

<div id="app">
    <div id="document">
            <div id="welcome">
                <h1><img src="lib/img/logo.png"> SpritePad <small>v 0.2</small></h1>
                <div class="body">
                    <div class="row">
                        <div>
                            <p>Drag & Drop image files to your SpritePad document and create CSS spritemaps easy and fast.</p>
                            <p>Give it a try!</p>
                        </div>
                        <div>
                            <p style="text-align: center;">
                                <button class="action newdoc">Create new spritemap</button>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="info">
                    &copy; 2011 <a href="http://wearekiss.com">KISS</a> - Made in Germany
                </div>

            </div>
            <div id="excanvas" style="display: none;">
                    <div id="canvas" style="display: none;"></div>
            </div>
    </div>
    <div id="sidebar">
        <div class="actions">
            <img src="lib/img/new.png" id="new_document" title="New SpritePad">
            <img src="lib/img/download.png" id="download_document" class="deactivated" title="Download SpritePad data">
            <img src="lib/img/settings.png" id="btn-settings" class="deactivated" title="Define different settings">
            <div class="dropdown" id="settings">
                <div class="anchor"><img src="lib/img/settings.png" title="Define different settings"></div>
                <div class="content">
                    <label><input checked type="checkbox" data-option="magnetic"> Magnetic elements and guides</label>
                    <label><input checked type="checkbox" data-option="magnetspace"> Preserve 1px spaces</label>
                    <label><input type="checkbox" data-option="gridsnap"> Snap elements to grid</label>
                    <label><input type="checkbox" data-option="drawbounding"> Draw bounding masks</label>
                </div>
            </div>
        </div>
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