/*
Copyright (c) 2012 Florian Douetteau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/ 


d3.cache = {}
d3.cache.enabled = true; 
d3.cache.cache_list = null; 
d3.cache.enable = function() {
  d3.cache.enabled = true; 
}

d3.cache.disable = function() { 
  d3.cache.enabled = false; 
}

d3.cache.clear = function() { 
  for(i = 0; ; i++) { 
    k = window.localStorage.key(i);
    if (k == null) {
      break;
    }
    if (k.indexOf("d3_dsv") == 0) { 
      window.localStorage.removeItem(k); 
    }
  } 
}

d3.cache.set_cache_configuration = function(cache_map) { 
  d3.cache.cache_list = cache_map;
  d3.cache.enabled = true;  
}

d3.cache.should_cache = function(url) { 
  if (!d3.cache.enabled) return false; 
  if (!d3.cache.cache_list) return true; 
  return url in d3.cache.cache_list; 
}

function d3_cache_module(d3) { 
  function d3_dsv_localstorage(dsv, mimeType) { 
   


   function dsv_cache(url, callback) {
    if (!d3.cache.should_cache(url)) { 
        return dsv(url, callback); 
    }
    key = 'd3_dsv' + url; 
    if (key in window.localStorage) { 
     callback(dsv.parse(window.localStorage[key])); 
     return; 
    } else  { 
    d3.text(url, mimeType, function(text) {
    			// reuse dsv.parse from the d3 module directly. 
          callback(text && dsv.parse(text));
          window.localStorage[key] = text; 
        });
  }
}
return dsv_cache; 
}
d3.cache.csv = d3_dsv_localstorage(d3.csv, "text/csv"); 
d3.cache.tsv = d3_dsv_localstorage(d3.tsv, "text/tab-separated-values"); 
}

d3_cache_module(d3); 

