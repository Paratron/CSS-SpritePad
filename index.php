<!DOCTYPE html>
<html lang="de">
<head>
    <title>SpritePad</title>
    <link rel="shortcut icon" href="favicon.ico" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link href="lib/css/main.css?<?=filemtime('lib/css/main.css')?>" type="text/css" rel="stylesheet" media="screen">
</head>
<body>

<div id="app">
    <div id="document">
            <div id="welcome">
                <h1><img src="lib/img/logo.png"> SpritePad <small>v 0.1</small></h1>
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
            <div id="excanvas">
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