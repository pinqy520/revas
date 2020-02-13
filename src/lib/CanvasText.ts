
export class CanvasText {
  // The property that will contain the ID attribute value.
  canvasId: string = 'null';
  // The property that will contain the Canvas element.
  canvas!: HTMLCanvasElement;
  // The property that will contain the canvas context.
  context!: CanvasRenderingContext2D;
  // The property that will contain the created style class.
  savedClasses: any = {};

  /*
   * Default values.
   */
  fontFamily: any = "Verdana";
  fontWeight: any = "normal";
  fontSize: any = "12px";
  fontColor: any = "#000";
  fontStyle: any = "normal";
  textAlign: any = "start";
  textBaseline: any = "alphabetic";
  lineHeight: any = "16";
  textShadow: any = null;

  config(config: any) {
    var property;
    /*
     * A simple check. If config is not an object popup an alert.
     */
    if (typeof (config) !== "object") {
      alert("¡Invalid configuration!");
      return false;
    }
    /*
     * Loop the config properties.
     */
    for (property in config) {
      // If it's a valid property, save it.
      (this as any)[property] = config[property];
    }
  }

  drawStyledText(textInfo: any) {
    // Save the textInfo into separated vars to work more comfortably.
    const { text, boxWidth } = textInfo
    let { x, y } = textInfo
    // Needed vars for automatic line break;
    const textLines: any[] = []
    var splittedText, xAux
    // Declaration of needed vars.
    var proFont: any = {}
    var properties, property, propertyName, propertyValue, atribute;
    var classDefinition, proColor, proText, proShadow;


    // The main regex. Looks for <style>, <class> or <br /> tags.
    var match = text.match(/<\s*br\s*\/>|<\s*class=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/class\s*\>|<\s*style=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/style\s*\>|[^<]+/g);
    var innerMatch = null;

    // Let's draw something for each match found.
    for (let i = 0; i < match.length; i++) {
      // Save the current context.
      this.context.save();
      // Default color
      proColor = this.fontColor;
      // Default font
      proFont.style = this.fontStyle;
      proFont.weight = this.fontWeight;
      proFont.size = this.fontSize;
      proFont.family = this.fontFamily;

      // Default shadow
      proShadow = this.textShadow;

      // Check if current fragment is an style tag.
      if (/<\s*style=/i.test(match[i])) {
        // Looks the attributes and text inside the style tag.
        innerMatch = match[i].match(/<\s*style=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/style\s*\>/);

        // innerMatch[1] contains the properties of the attribute.
        properties = innerMatch[1].split(";");

        // Apply styles for each property.
        for (let j = 0; j < properties.length; j++) {
          // Each property have a value. We split them.
          property = properties[j].split(":");
          // A simple check.
          if (this.isEmpty(property[0]) || this.isEmpty(property[1])) {
            // Wrong property name or value. We jump to the
            // next loop.
            continue;
          }
          // Again, save it into friendly-named variables to work comfortably.
          propertyName = property[0];
          propertyValue = property[1];

          switch (propertyName) {
            case "font":
              proFont = propertyValue;
              break;
            case "font-family":
              proFont.family = propertyValue;
              break;
            case "font-weight":
              proFont.weight = propertyValue;
              break;
            case "font-size":
              proFont.size = propertyValue;
              break;
            case "font-style":
              proFont.style = propertyValue;
              break;
            case "text-shadow":
              proShadow = this.trim(propertyValue);
              proShadow = proShadow.split(" ");
              if (proShadow.length != 4) {
                proShadow = null;
              }
              break;
            case "color":
              if (this.isHex(propertyValue)) {
                proColor = propertyValue;
              }
              break;
          }
        }
        proText = innerMatch[2];

      } else if (/<\s*class=/i.test(match[i])) { // Check if current fragment is a class tag.
        // Looks the attributes and text inside the class tag.
        innerMatch = match[i].match(/<\s*class=["|']([^"|']+)["|']\s*\>([^>]+)<\s*\/class\s*\>/);

        classDefinition = this.getClass(innerMatch[1]);
        /*
         * Loop the class properties.
         */
        for (atribute in classDefinition) {
          switch (atribute) {
            case "font":
              proFont = classDefinition[atribute];
              break;
            case "fontFamily":
              proFont.family = classDefinition[atribute];
              break;
            case "fontWeight":
              proFont.weight = classDefinition[atribute];
              break;
            case "fontSize":
              proFont.size = classDefinition[atribute];
              break;
            case "fontStyle":
              proFont.style = classDefinition[atribute];
              break;
            case "fontColor":
              if (this.isHex(classDefinition[atribute])) {
                proColor = classDefinition[atribute];
              }
              break;
            case "textShadow":
              proShadow = this.trim(classDefinition[atribute]);
              proShadow = proShadow.split(" ");
              if (proShadow.length != 4) {
                proShadow = null;
              }
              break;
          }
        }
        proText = innerMatch[2];
      } else if (/<\s*br\s*\/>/i.test(match[i])) {
        // Check if current fragment is a line break.
        y += parseInt(this.lineHeight, 10) * 1.5;
        x = textInfo.x;
        continue;
      } else {
        // Text without special style.
        proText = match[i];
      }

      // Set the text Baseline
      this.context.textBaseline = this.textBaseline;
      // Set the text align
      this.context.textAlign = this.textAlign;
      // Font styles.
      if (proFont) {
        this.context.font = proFont.style + " " + proFont.weight + " " + proFont.size + " " + proFont.family;
      } else {
        this.context.font = proFont;
      }
      this.context.font = proFont;
      // Set the color.
      this.context.fillStyle = proColor;
      // Set the Shadow.
      if (proShadow != null) {
        this.context.shadowOffsetX = proShadow[0].replace("px", "");
        this.context.shadowOffsetY = proShadow[1].replace("px", "");
        this.context.shadowBlur = proShadow[2].replace("px", "");
        this.context.shadowColor = proShadow[3].replace("px", "");
      }

      // Reset textLines;
      textLines.length = 0;
      // Clear javascript code line breaks.
      proText = proText.replace(/\s*\n\s*/g, " ");

      // Automatic Line break
      if (boxWidth !== undefined) {

        // If returns true, it means we need a line break.
        if (this.checkLineBreak(proText, (boxWidth + textInfo.x), x)) {
          // Split text by words.
          splittedText = this.trim(proText).split(" ");

          // If there's only one word we don't need to make more checks.
          if (splittedText.length == 1) {
            textLines.push({ text: this.trim(proText) + " ", linebreak: true });
          } else {
            // Reset vars.
            xAux = x;
            var line = 0;
            textLines[line] = { text: undefined, linebreak: false };

            // Loop words.
            for (let k = 0; k < splittedText.length; k++) {
              splittedText[k] += " ";
              // Check if the current text fits into the current line.
              if (!this.checkLineBreak(splittedText[k], (boxWidth + textInfo.x), xAux)) {
                // Current text fit into the current line. So we save it
                // to the current textLine.
                if (textLines[line].text == undefined) {
                  textLines[line].text = splittedText[k];
                } else {
                  textLines[line].text += splittedText[k];
                }

                xAux += this.context.measureText(splittedText[k]).width;
              } else {
                // Current text doesn't fit into the current line.
                // We are doing a line break, so we reset xAux
                // to initial x value.
                xAux = textInfo.x;
                if (textLines[line].text !== undefined) {
                  line++;
                }

                textLines[line] = { text: splittedText[k], linebreak: true };
                xAux += this.context.measureText(splittedText[k]).width;
              }
            }
          }
        }
      }

      // if textLines.length == 0 it means we doesn't need a linebreak.
      if (textLines.length == 0) {
        textLines.push({ text: this.trim(proText) + " ", linebreak: false });
      }

      // Let's draw the text
      for (let n = 0; n < textLines.length; n++) {
        // Start a new line.
        if (textLines[n].linebreak) {
          y += parseInt(this.lineHeight, 10);
          x = textInfo.x;
        }
        this.context.fillText(textLines[n].text, x, y);
        // Increment X position based on current text measure.
        x += this.context.measureText(textLines[n].text).width;
      }

      this.context.restore();
    }
  }

  defineClass(id: string, definition: any) {
    // A simple check.
    if (typeof (definition) != "object") {
      alert("¡Invalid class!");
      return false;
    }
    // Another simple check.
    if (this.isEmpty(id)) {
      alert("You must specify a Class Name.");
      return false;
    }

    // Save it.
    this.savedClasses[id] = definition;
    return true;
  }
  /**
 * Returns a saved class.
 */
  getClass(id: string) {
    if (this.savedClasses[id] !== undefined) {
      return this.savedClasses[id];
    }
  }

  getCanvas() {
    // We need a valid ID
    if (this.canvasId == null) {
      alert("You must specify the canvas ID!");
      return false;
    }
    // Let's save the Canvas into our class property...
    this.canvas = (document.getElementById(this.canvasId) as any);
    // ... and save its context too.
    this.context = this.canvas.getContext('2d')!;

    return true;
  };

  /**
   * Check if a line break is needed.
   */
  checkLineBreak(text: string, boxWidth: number, x: number) {
    return (this.context.measureText(text).width + x > boxWidth);
  };

  /**
   * A simple function to validate a Hex code.
   */
  isHex(hex: string) {
    return (/^(#[a-fA-F0-9]{3,6})$/i.test(hex));
  };
  /**
   * A simple function to check if the given value is a number.
   */
  isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
  /**
   * A simple function to check if the given value is empty.
   */
  isEmpty(str: string) {
    // Remove white spaces.
    str = str.replace(/^\s+|\s+$/, '');
    return str.length == 0;
  };
  /**
   * A simple function clear whitespaces.
   */
  trim(str: string) {
    var ws, i;
    str = str.replace(/^\s\s*/, '');
    ws = /\s/;
    i = str.length;
    while (ws.test(str.charAt(--i))) {
      continue;
    }
    return str.slice(0, i + 1);
  };
}

