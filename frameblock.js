
    /* FrameBlock 1.2.4 */
    /* February 13, vsnits 2023 */

    let trusted = ["&google.com", "github.com", "lichess.org", "&youtube.com", "&wikipedia.org"]
    function includesDomain(list) {
        /* Check whether the website is known app or is not.*/
        var doc = document.URL // shortcut the document.URL
        var host = "" // host like ‘http://’
        var res = "" // result like ‘****.com’
        for(var e = 0; e < list.length; e++) {
            var zone = 0 
            var skip = false
            if(list[e][0] == "&") { skip = true }
            for(var i = 0; i < doc.length; i++) {
                if(doc[i] == "/") { zone++ }            
                else if(zone < 1) { host += doc[i] }
                else if(zone > 1 && zone < 3 && !skip) { res += doc[i] }
                if(doc[i] == "." && skip) { skip = false }
                }
            var short =  "";
            while(short.length+1 < list[e].length) { short += list[e][short.length+1] }
            var item = (list[e][0] == "&") ? (short) : list[e] // get correct name
            if(item == res) { return true }
            res = ""
            }; return false
        };

   function insert(where, element, before) {
        /* 
         Insert element before its following element.
         Whether the following element `before` is not defined, then the element is last in its group, and so it just appends.
        */        
        if(before) { where.insertBefore(element, before) }
        else { where.append(element) }
        };

   var methods = new Array()   
    /* 
    An array of objects like { tag: "", filter: function(e) { return } } 
    Elements list will be created by tag and every element of list goes through a filter as an argument. 
    Whether `filter` returns true, element deleting from its parent. 
   */
    methods.push({ tag: 'div', filter: function(e) {
            /* 
             Checking for shadow DOM,
             There are no methods to remove shadowRoot, however we can remove shadowRoot's parent element. 
             The idea is to remove element and carefully replace with its clone, therefore delete shadowRoot.
            */
            if(!e.children.length && innerWidth*innerHeight*0.02 < e.offsetWidth*e.offsetHeight) {
                /* Only large empty divs are checked */
                var hand = e.parentElement
                var group = hand.children 
                var place = 0 // define position where div is in group
                while(place < group.length) {
                    if(group[place] == e) { break } // position now defined
                    else { place++ }
                    } // the position will be defined in all cases, as we know that group contains all children `hand`
                hand.removeChild(e) // now remove original element and replace with its clone
                /* Element also removed from its group, so (place+1) become just (place) */
                insert(hand, e.cloneNode(29), group[place]) // inserting to original position
                return false // no need to remove element
                }
            } 
        })
    methods.push({ tag: 'frame', filter: function(e) { return true } }) // Just remove all the frames
    methods.push({ tag: 'iframe', filter: function(e) { return true } }) // And iframes too
    methods.push({ tag: 'yatag', filter: function(e) { return true } }) // Removing a kind of banners
    methods.push({ tag: 'a', filter: function(e) { // And remove banners itself
            if(e.getElementsByTagName("img").length || e.getElementsByTagName("video").length) {
                /* Whether the link has a child image or video, it is a banner. */
                return true // removing
                }
            } 
        })
    methods.push({ tag: 'video', filter: function(e) {
            if(e.autoplay || e.playsinline || e.muted) { return true } // try remove autoplay
            } 
        })
    function block(includes_domain=null) { // reading methods
        if(includes_domain==false || block.target) { // whether domain not found
            block.target = true // indicate that domain not found
            var blocked = new Array() // create an array of removed elements
            function remove(tag, filter=function() { return true }) { // remove elements by tag
                /* Function takes not only tag names but also an arrays */
                var things; (typeof tag == 'string') ? things = document.getElementsByTagName(tag) : things = tag
                for(var i = 0; i < things.length; i++) { // filtering items
                    /* Whether filter is true, remember element and remove */
                    if(filter(things[i])) { blocked.push(things[i]); things[i].parentElement.removeChild(things[i]); }
                    }
                }
            for(var i = 0; i < methods.length; i++) { // finally go through the all methods
                remove(methods[i].tag, methods[i].filter) // removing
                }; if(blocked.length) { console.log("frames blocked > ", blocked) } // and.. output the removed items
             } else if(includes_domain == true) { console.log("Good website!") }
           setTimeout(function() { if(block.target == true) { block() } }, 900) // repeat every 900 ms
        }; block( includesDomain(trusted) ) // finally call the function

    /**/
