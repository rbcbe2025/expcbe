<?xml version="1.0" encoding="UTF-8"?>
<!-- The detail of one project: a render over the object's own document (<item>). The process binds it with
     select="/" and the fields below it with select="/item/title" and so on, so typing in a field changes this
     view at once: both are bound to the same document. Classes come from the kit's designkit.css. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <xsl:for-each select="item">
      <div class="dk-detail">
        <p class="dk-eyebrow"><xsl:value-of select="status"/></p>
        <h2 class="dk-h1"><xsl:value-of select="title"/></h2>
        <p class="dk-body"><xsl:value-of select="notes"/></p>
        <p class="dk-muted">Created <xsl:value-of select="created"/></p>
      </div>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
