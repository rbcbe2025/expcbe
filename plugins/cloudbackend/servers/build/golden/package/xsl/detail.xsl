<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <div>
      <xsl:apply-templates select="item"/>
      <br/>
    </div>
  </xsl:template>
  <xsl:template match="item">
    <p><xsl:apply-templates/></p>
  </xsl:template>
</xsl:stylesheet>
