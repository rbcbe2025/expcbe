<?xml version="1.0" encoding="UTF-8"?>
<!-- Skin for <statusline> (the CA_Status component; the tag is not "status", which is a native view element): a bar the CSS pins to the bottom of the window, hidden until notify(). -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:template match="statusline">
    <div id="{@name}" class="xios-status {@class}" role="status" aria-live="polite" style="display:none">
      <span id="{@name}_Spin" class="xios-status-spin" aria-hidden="true"></span>
      <span id="{@name}_Text" class="xios-status-text"></span>
      <button id="{@name}_Close" type="button" class="xios-status-close" aria-label="Dismiss">&#215;</button>
    </div>
  </xsl:template>
</xsl:stylesheet>
