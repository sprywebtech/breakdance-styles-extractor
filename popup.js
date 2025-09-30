document.getElementById('extractBtn').addEventListener('click', async () => {
  const btn = document.getElementById('extractBtn');
  const status = document.getElementById('status');
  
  btn.disabled = true;
  btn.textContent = 'Extracting...';
  status.className = 'status';
  status.style.display = 'none';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractStyles
    });
    
    const styles = results[0].result;
    
    // Download the JSON file
    const blob = new Blob([JSON.stringify(styles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'breakdance-global-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    status.className = 'status success';
    status.textContent = 'Styles extracted successfully! Check your downloads.';
    
  } catch (error) {
    status.className = 'status error';
    status.textContent = 'Error: ' + error.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Extract Styles from Page';
  }
});

function extractStyles() {
  // Helper function to convert any CSS unit to rem
  function toRem(value, element = document.documentElement) {
    if (!value) return { number: 1, unit: 'rem', style: '1rem' };
    
    const match = String(value).match(/^([-\d.]+)(.*)$/);
    if (!match) return { number: 1, unit: 'rem', style: '1rem' };
    
    let num = parseFloat(match[1]);
    const unit = match[2] || 'px';
    
    // Convert to pixels first if needed
    if (unit === 'px') {
      // Already in pixels
    } else if (unit === 'em') {
      const fontSize = parseFloat(getComputedStyle(element).fontSize);
      num = num * fontSize;
    } else if (unit === '%') {
      const fontSize = parseFloat(getComputedStyle(element).fontSize);
      num = (num / 100) * fontSize;
    } else if (unit === 'pt') {
      num = num * 1.333;
    } else if (unit === 'rem') {
      // Already in rem, but convert through px for consistency
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      num = num * rootFontSize;
    }
    
    // Now convert pixels to rem
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const remValue = num / rootFontSize;
    const rounded = Math.round(remValue * 100) / 100;
    
    return {
      number: rounded,
      unit: 'rem',
      style: `${rounded}rem`
    };
  }
  
  // Helper to convert RGB to hex
  function rgbToHex(rgb) {
    if (!rgb) return '#000000FF';
    
    const result = rgb.match(/\d+/g);
    if (!result) return '#000000FF';
    
    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);
    const a = result[3] ? parseInt(result[3]) : 255;
    
    return '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0') + 
      a.toString(16).padStart(2, '0');
  }
  
  // Extract colors from the page
  function extractColors() {
    const colors = new Set();
    const elements = document.querySelectorAll('*');
    
    elements.forEach(el => {
      const styles = getComputedStyle(el);
      if (styles.color) colors.add(rgbToHex(styles.color).toUpperCase());
      if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        colors.add(rgbToHex(styles.backgroundColor).toUpperCase());
      }
    });
    
    const colorArray = Array.from(colors).filter(c => c !== '#00000000');
    
    return {
      brand: colorArray[0] || '#5D4396FF',
      text: colorArray[1] || '#4E4A58FF',
      headings: colorArray[2] || '#121212FF',
      links: colorArray[3] || '#2E78DAFF',
      background: '#FFFFFFFF',
      palette: {
        colors: colorArray.slice(4, 6).map((color, i) => ({
          cssVariableName: `bde-palette-color-${i + 1}-${Math.random().toString(36).substr(2, 9)}`,
          label: `Additional Color ${i + 1}`,
          value: color
        })),
        gradients: []
      }
    };
  }
  
  // Extract typography
  function extractTypography() {
    const body = document.body;
    const bodyStyles = getComputedStyle(body);
    const h1 = document.querySelector('h1') || body;
    const h2 = document.querySelector('h2') || body;
    const h3 = document.querySelector('h3') || body;
    const h4 = document.querySelector('h4') || body;
    const h5 = document.querySelector('h5') || body;
    const h6 = document.querySelector('h6') || body;
    
    // Extract font families
    const bodyFont = bodyStyles.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    const headingFont = getComputedStyle(h1).fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    
    // Convert font names to breakdance format (gfont- prefix for Google Fonts)
    const formatFont = (font) => {
      const cleaned = font.toLowerCase().replace(/\s+/g, '');
      return `gfont-${cleaned}`;
    };
    
    return {
      heading_font: formatFont(headingFont),
      body_font: formatFont(bodyFont),
      base_size: {
        breakpoint_base: toRem(bodyStyles.fontSize)
      },
      advanced: {
        headings: {
          all_headings: {
            typography: {
              custom: {
                customTypography: {
                  advanced: {
                    textTransform: {
                      breakpoint_base: getComputedStyle(h1).textTransform
                    }
                  },
                  fontWeight: {
                    breakpoint_base: getComputedStyle(h1).fontWeight
                  }
                }
              }
            }
          },
          h1: {
            typography: {
              custom: {
                customTypography: {
                  fontSize: {
                    breakpoint_base: toRem(getComputedStyle(h1).fontSize, h1)
                  }
                }
              }
            }
          },
          h2: {
            typography: {
              custom: {
                customTypography: {
                  fontSize: {
                    breakpoint_base: toRem(getComputedStyle(h2).fontSize, h2)
                  }
                }
              }
            }
          },
          h3: {
            typography: {
              custom: {
                customTypography: {
                  fontSize: {
                    breakpoint_base: toRem(getComputedStyle(h3).fontSize, h3)
                  }
                }
              }
            }
          },
          h4: {
            typography: {
              custom: {
                customTypography: {
                  fontSize: {
                    breakpoint_base: toRem(getComputedStyle(h4).fontSize, h4)
                  }
                }
              }
            }
          },
          h5: {
            typography: {
              custom: {
                customTypography: {
                  fontSize: {
                    breakpoint_base: toRem(getComputedStyle(h5).fontSize, h5)
                  }
                }
              }
            }
          },
          h6: {
            typography: {
              custom: {
                customTypography: {
                  fontSize: {
                    breakpoint_base: toRem(getComputedStyle(h6).fontSize, h6)
                  }
                }
              }
            }
          }
        }
      }
    };
  }
  
  // Extract button styles
  function extractButtons() {
    const buttons = document.querySelectorAll('button, .button, .btn, a.cta, [class*="button"]');
    
    if (buttons.length === 0) {
      return {
        primary: {
          size: {
            size: { breakpoint_base: "custom" },
            padding: {
              breakpoint_base: {
                top: { number: 10, unit: 'px', style: '10px' },
                bottom: { number: 10, unit: 'px', style: '10px' },
                left: { number: 20, unit: 'px', style: '20px' },
                right: { number: 20, unit: 'px', style: '20px' }
              }
            }
          },
          background: 'var(--bde-links-color)'
        },
        secondary: {
          outline: true,
          color: 'var(--bde-brand-color)',
          no_fill_on_hover: true
        }
      };
    }
    
    const primaryBtn = buttons[0];
    const styles = getComputedStyle(primaryBtn);
    
    return {
      primary: {
        size: {
          size: { breakpoint_base: "custom" },
          padding: {
            breakpoint_base: {
              top: { number: parseInt(styles.paddingTop) || 10, unit: 'px', style: styles.paddingTop || '10px' },
              bottom: { number: parseInt(styles.paddingBottom) || 10, unit: 'px', style: styles.paddingBottom || '10px' },
              left: { number: parseInt(styles.paddingLeft) || 20, unit: 'px', style: styles.paddingLeft || '20px' },
              right: { number: parseInt(styles.paddingRight) || 20, unit: 'px', style: styles.paddingRight || '20px' }
            }
          }
        },
        background: rgbToHex(styles.backgroundColor).toUpperCase()
      },
      secondary: {
        outline: true,
        color: rgbToHex(styles.color).toUpperCase(),
        no_fill_on_hover: true
      }
    };
  }
  
  // Build the final JSON structure
  return {
    settings: {
      colors: extractColors(),
      buttons: extractButtons(),
      typography: extractTypography()
    }
  };
}