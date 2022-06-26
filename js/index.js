//
// Code by Yunus Yıldız(Risky)
// ===========================================================================
//
// Note: If you put in onload, it not making the variable global. Instead, it becomes local.

// var currentsize = getComputedStyle(document.documentElement).getPropertyValue('--big-button-size');
// Get root element and set margin of left side by button sizes
// document.documentElement.style.setProperty("--align-relatives-fromsidenav", currentsize);
var timeouthalf, currentSelection, clickedElement, timeout_addnote, timeout_addnoteClearAnimation, timeout_resizeBoxAnimation, timeout_resizeTextInitialization, i, notetemplate, lastnote = 1, lastContainerHeight = 0;
// $.contains(this, event.target) is faster than the find or children. Will update soon as possible.
var createnotetemplate = function(){
notetemplate = $('<div>', {
    class: 'cl_note'
});
$('<div>', {
    class: 'cl_note-title'
}).appendTo(notetemplate);

$('<textarea>', {
    class: 'input_text cl_textarea noEnter font-medium',
    placeholder: 'Title',
    maxlength: '75'
}).appendTo($(notetemplate).children('.cl_note-title'));

$('<div>', {
    class: 'cl_note-message'
}).appendTo(notetemplate);

$('<textarea>', {
    class: 'input_text cl_textarea font-medium',
    placeholder: 'Message',
    maxlength: '400',
}).appendTo($(notetemplate).children('.cl_note-message'));

$('<div>', {
    class: 'horizontal_content',
    style: 'justify-content: space-evenly;'
}).append(
  $('<button>', {
      class: 'cl_button button_hover button_defaultsize button_mobilepadding'
}).append(
  $('<svg>', {
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    fill: 'none'
})).append(
  $('<path>', {
    fill: "currentColor",
    d: "M14.8284 12L16.2426 13.4142L19.071 10.5858C20.6331 9.02365 20.6331 6.49099 19.071 4.9289C17.509 3.3668 14.9763 3.3668 13.4142 4.9289L10.5858 7.75732L12 9.17154L14.8284 6.34311C15.6095 5.56206 16.8758 5.56206 17.6568 6.34311C18.4379 7.12416 18.4379 8.39049 17.6568 9.17154L14.8284 12Z"
})
).append(
  $('<path>', {
    fill: "currentColor",
    d:"M12 14.8285L13.4142 16.2427L10.5858 19.0711C9.02372 20.6332 6.49106 20.6332 4.92896 19.0711C3.36686 17.509 3.36686 14.9764 4.92896 13.4143L7.75739 10.5858L9.1716 12L6.34317 14.8285C5.56212 15.6095 5.56212 16.8758 6.34317 17.6569C7.12422 18.4379 8.39055 18.4379 9.1716 17.6569L12 14.8285Z"
  })
)).appendTo(notetemplate);



// $('<svg>', {
//   viewBox: "0 0 24 24",
//   xmlns: "http://www.w3.org/2000/svg"
// }).appendTo($(notetemplate).children('.horizontal_content').last().children('button').last());

// $('<path>'), {
//   fill: "currentColor",
//   d: "M14.8284 12L16.2426 13.4142L19.071 10.5858C20.6331 9.02365 20.6331 6.49099 19.071 4.9289C17.509 3.3668 14.9763 3.3668 13.4142 4.9289L10.5858 7.75732L12 9.17154L14.8284 6.34311C15.6095 5.56206 16.8758 5.56206 17.6568 6.34311C18.4379 7.12416 18.4379 8.39049 17.6568 9.17154L14.8284 12Z"
// }

// $('<path>'), {
//   fill: "currentColor",
//   d:"M12 14.8285L13.4142 16.2427L10.5858 19.0711C9.02372 20.6332 6.49106 20.6332 4.92896 19.0711C3.36686 17.509 3.36686 14.9764 4.92896 13.4143L7.75739 10.5858L9.1716 12L6.34317 14.8285C5.56212 15.6095 5.56212 16.8758 6.34317 17.6569C7.12422 18.4379 8.39055 18.4379 9.1716 17.6569L12 14.8285Z"
// }
// $('<path>'), {
//   fill: "currentColor",
//   d:"M14.8285 10.5857C15.219 10.1952 15.219 9.56199 14.8285 9.17147C14.4379 8.78094 13.8048 8.78094 13.4142 9.17147L9.1716 13.4141C8.78107 13.8046 8.78107 14.4378 9.1716 14.8283C9.56212 15.2188 10.1953 15.2188 10.5858 14.8283L14.8285 10.5857Z"
// }

console.log("Note Initalization: Success");
};

createnotetemplate();

window.onclick=function(e){
  clickedElement = e;
  console.log($('#justatest'));
}

window.onload=function(){
  $("#cl_menu").click(function(e){
    // Basit bir taktikle c++ projelerimden ogrendigim bir toggle taktigini uyguladım. Ancak else yerine else if kullanılmalı ki targetin bu bizim menu oldugunu kanıtlayalım.
    if($(this).attr("is-expanded") == "false")
    {
      // For mobile
      // if(['xxx-small', 'extrasmall', 'small', 'medium'].indexOf(getRootAttr("--device-model")) >= 0) $("#cl_sidenav").focus();
      $("#cl_sidenav").focus();

      $('#cl_sidenav').addClass("sidenav-expanded");
      $(this).attr("is-expanded", "true");
      $('#cl_sidenav').find(".cl_button").addClass("sidenav-expandinside");
      // Root elementini alıyoruz. Documentelement bu yuzden kullandık.
      // document.documentElement.style.setProperty("--align-relatives-fromsidenav", (getComputedStyle(document.documentElement).getPropertyValue("--sidebar-expanded-big")));
      if(['desktop'].indexOf(getRootAttr("--device-model")) >= 0){
        setRootAttr("--align-relatives-fromsidenav", getRootAttr("--sidebar-expanded-big"));
        reorderNotes();
      }
    }
    else if($(this).has(e.target))
    {
      $('#cl_sidenav').removeClass("sidenav-expanded");
      $(this).attr("is-expanded", "false");
      $('#cl_sidenav').find(".cl_button").removeClass("sidenav-expandinside");
      // document.documentElement.style.setProperty("--align-relatives-fromsidenav", (getComputedStyle(document.documentElement).getPropertyValue("--big-button-size")));
      if(['desktop'].indexOf(getRootAttr("--device-model")) >= 0){
        setRootAttr("--align-relatives-fromsidenav", getRootAttr("--big-button-size"));
        reorderNotes();
      }
    }
  });

  $('#cl_sidenav').hover(function(){
    $(this).addClass("sidenav-expanded");
    $(this).find(".cl_button").addClass("sidenav-expandinside");
  },
  function(){
    if($("#cl_menu").attr("is-expanded") != "true"){
      //clearTimeout(timeouthalf);
      $(this).removeClass("sidenav-expanded");
      $(this).find(".cl_button").removeClass("sidenav-expandinside");
    }
  });


  $('#cl_sidenav').focusout(function(e){
    if($('#cl_menu').attr("is-expanded") == "true" && ['xxx-small', 'extrasmall', 'small', 'medium'].indexOf(getRootAttr("--device-model")) >= 0)
    {
      $('#cl_sidenav').removeClass("sidenav-expanded");
      $('#cl_menu').attr("is-expanded", "false");
      $('#cl_sidenav').find(".cl_button").removeClass("sidenav-expandinside");
    }
  });

// Addnote area Animations!
  $('#cl_addnote-titletext').focus(function(){
    if((checkifEmpty('#cl_addnote-messagetext') && checkifEmpty('#cl_addnote-titletext')))
    {
      clearTimeout(timeout_addnote);
      $('#cl_addnote-message').css("opacity", 1);
      $('#cl_addnotearea').height("113px");
      timeout_addnoteClearAnimation = setTimeout(function(){
        $('#cl_addnotearea').removeAttr("style");
      }, 500);
      $('#cl_addnote-message').removeClass("hide");
    }
  })
  .focusout(function()
  {
    setTimeout(function() {
      if(!(clickedElement.target.id == 'cl_addnote-messagetext') && (checkifEmpty('#cl_addnote-messagetext') && checkifEmpty('#cl_addnote-titletext')))
      {
        $('#cl_addnote-message').css("opacity", 0);
        clearTimeout(timeout_addnoteClearAnimation);
        $('#cl_addnotearea').height("112px");
        // 125px normal
        $('#cl_addnotearea').height("38px");
        timeout_addnote = setTimeout(function() {
            $('#cl_addnote-message').addClass("hide");
        }, 500);
      }
    }, 100);
  });

  $('#cl_addnote-messagetext').focusout(function()
  {
    setTimeout(function() {
      if(!(clickedElement.target.id == 'cl_addnote-titletext') && (checkifEmpty('#cl_addnote-messagetext') && checkifEmpty('#cl_addnote-titletext')))
      {
        $('#cl_addnote-message').css("opacity", 0);
        $('#cl_addnotearea').height("112px");
        $('#cl_addnotearea').height("38px");
        timeout_addnote = setTimeout(function() {
            $('#cl_addnote-message').addClass("hide");
        }, 500);
      }
    }, 100);
  });

  // Add note! The most important part is here-------------------------------------------------------- coded by Yunus YILDIZ
  $('#cl_addnote-button').click(function(){
    var noteattritubes = [$('#cl_addnote-titletext').val(), $('#cl_addnote-messagetext').val(), notetemplate, ""];
    noteattritubes[2] = $(notetemplate).clone();
    //  We would get all textareas inside of those divs and select it with [] but NO DUDE its still in development mode
    $(noteattritubes[2]).find('.cl_note-title').find('textarea').val(noteattritubes[0]);
    $(noteattritubes[2]).find('.cl_note-message').find('textarea').val(noteattritubes[1]);
    $(noteattritubes[2]).attr('id', "cl_note-" + lastnote);

    $(noteattritubes[2]).prependTo($('#cl_shownotesarea'));
    // Lastnote was set to 1 so we need to make that empty fr!!!!!!!!!
    noteattritubes[3] = $('#cl_note-' + lastnote);
    noteattritubes[3] = document.getElementById('cl_note-' + lastnote);
    $(noteattritubes[2]).find('textarea').each(function(){
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    // Set note height and make them animateable!
    addDummy(noteattritubes[3], defaultDuration);

    $('textarea').on('input paste change', function(){
      autogrow(this);
    });

    // Put it on right area
    setTimeout(function(){
      reorderNotes();
    }, 50);


    lastnote++;
  });

  function setRootAttr(txt1, txt2){
    document.documentElement.style.setProperty(txt1, txt2);
  }

  function getRootAttr(txt1){
    return getComputedStyle(document.documentElement).getPropertyValue(txt1);
  }

  function checkifEmpty(elem)
  {
    if(!($(elem).val()))
    {
      return 1;
    }
    return 0;
  }

  function autogrow(elem){
    // Can be found with normal id too will develop soon IMPORTANT---------
    // var noteitem = $(elem).closest('.cl_note'), dummyitem = dummyList.find((e) => { return e['__flex-wrap-anim_id'] === 'dummy-' + noteitem.attr('id') });
    // if(noteitem.length > 0 && ((noteitem.outerHeight() + notegap) + 'px') != dummyitem.style.height)
    // {
    //   dummyitem.style.width = (noteitem.outerWidth() + notegap) + 'px';
    //   dummyitem.style.height = (noteitem.outerHeight() + notegap) + 'px';
    //   reorderNotes();
    // }
    elem.style.height = 'auto';
    elem.style.height = (elem.scrollHeight) + 'px';
    var noteitem = $(elem).closest('.cl_note'), dummyitem = document.getElementById('dummy-' + noteitem.attr('id'));
    if(noteitem.length > 0 && ((noteitem.outerHeight() + notegap) + 'px') != dummyitem.style.height)
    {
      dummyitem.style.height = (noteitem.outerHeight() + notegap) + 'px';
    }
    reorderNotes();
  }


  // ANIMATION CODES https://codepen.io/hideya/pen/Jamabx Changed in this project by - Yunus Yıldız
  var targetClassName = 'flex-wrap-anim', defaultDuration = '0.3s', notegap=10;
  // top left right bottom
  var dummyList = [];
  // get all notes in the window
  function addDummy(item, duration) {
    var top = item.offsetTop;
    var left = item.offsetLeft;
    setTimeout(function() {
      item.style.position = 'absolute';
      item.style.top = top + 'px';
      item.style.left = left + 'px';

      var dummyDiv = document.createElement('div');
      dummyDiv.classList.add(targetClassName + '-dummy');
      var rect = item.getBoundingClientRect();
      dummyDiv.style.width = rect.width + notegap +  'px';
      dummyDiv.style.height = rect.height + notegap + 'px';
      dummyDiv.style.visibility = 'hidden';

      dummyDiv.id = 'dummy-' + item.id;
      dummyDiv['__' + targetClassName + '_height'] = dummyDiv.style.height;
      // dummyDiv['__' + targetClassName + '_id'] = 'dummy-' + item.id; TO FIND THE DUMMY DIV IN LIST SECOND WAY
      dummyDiv['__' + targetClassName + '_pair'] = item;
      dummyDiv['__' + targetClassName + '_duration'] = duration;
      //item.parentNode.appendChild(dummyDiv);
      /* added in mobile */ item.parentNode.prepend(dummyDiv);
      dummyList.push(dummyDiv);

    }, 0);
  }

  // Added Function attritube(yunus yıldız) to when we add notes, we will update locations!! So we will have to initalizenote after user create new note!
  var conts = document.getElementsByClassName(targetClassName);

  initializeNote(conts);
  function initializeNote(conts){
    for (var i = 0, max = conts.length; i < max; i++) {
      var cont = conts[i];
      cont.style.position = 'relative';
      var duration = cont.getAttribute('data-duration')
        || defaultDuration;
      var items = cont.getElementsByClassName('cl_note');
      // max was items.length
      for (var i = 0, max = items.length; i < max; i++) {
        addDummy(items[i], duration);
      }
    }
  }

  function reorderNotes(){
    dummyList.forEach(function(dummyDiv) {
      var item = dummyDiv['__' + targetClassName + '_pair'];
      var duration = dummyDiv['__' + targetClassName + '_duration'];
      if (item.offsetTop != dummyDiv.offsetTop) {
        item.style.transition = 'all ' + duration;
        item.style.top = dummyDiv.offsetTop + 'px';
        item.style.left = dummyDiv.offsetLeft + 'px';
      } else {
        item.style.transition = '';
        item.style.left = dummyDiv.offsetLeft + 'px';
      }
    });
  }

  window.addEventListener('resize', function(event) {
    clearTimeout(timeout_resizeTextInitialization);
    timeout_resizeTextInitialization = setTimeout(function(){
      setDisplayMode();

      console.log("Texts resized as window size!");
    }, 150);
    reorderNotes();
  });

  function setDisplayMode(){
    var windowsize = $(window).width();
    (windowsize <= 425) ? setRootAttr('--device-model', 'xxx-small') :
    (windowsize <= 600) ? setRootAttr('--device-model', 'extrasmall') :
    (windowsize <= 768) ? setRootAttr('--device-model', 'small') :
    (windowsize <= 992) ? setRootAttr('--device-model', 'medium') :
    (windowsize <= 1200) ? setRootAttr('--device-model', 'large') : setRootAttr('--device-model', 'desktop');

    switch(getRootAttr("--device-model"))
    {
      // Will set note sizes on small devices. Like 100 or 50px is enough. LETS GO

      // Flex start would be cool with this
      //  <= 425
      case 'xxx-small':
        setRootAttr("--note-width", (((windowsize/2)-(notegap*2))) + 'px');
        setRootAttr("--align-relatives-fromsidenav", '0');
      break;

      // <=600
      case 'extrasmall':
        setRootAttr("--note-width", (((windowsize/2)-(notegap*2))) + 'px');
        setRootAttr("--align-relatives-fromsidenav", '0');
      break;

      // <=768
      case 'small':
        setRootAttr("--note-width", (((windowsize/2)-(notegap*2))) + 'px');
        setRootAttr("--align-relatives-fromsidenav", '0');
      break;

      // <= 992
      case 'medium':
        setRootAttr("--note-width", (((windowsize/2)-(notegap*2)) - getRootAttr("--align-relatives-fromsidenav").substr(0, getRootAttr("--align-relatives-fromsidenav").length - 2)) + 'px');
        // THE SIDENAV WILL BE HIDDEN IN MEDIUM TOO!
        setRootAttr("--align-relatives-fromsidenav", '0');

      break;

      // <=1200
      case 'large':
        setRootAttr("--note-width", "400px");
        setRootAttr("--align-relatives-fromsidenav", getRootAttr("--big-button-size"));
      break;

      // > 1200
      case 'desktop':
        setRootAttr("--note-width", "400px");
        setRootAttr("--align-relatives-fromsidenav", getRootAttr("--big-button-size"));
      break;
    }

    $('.flex-wrap-anim-dummy').each(function() {
      this.style.width = parseInt(getRootAttr("--note-width").substr(0, getRootAttr("--note-width").length - 2)) + notegap + 'px';
    });
    setTimeout(function () {
      $('textarea').each(function() {
          autogrow(this);
      });
    }, 50);

    reorderNotes();
  }

  // Initialize no enter in components like text inputs
  $('.noEnter').keydown(function(e) {
  if(e.which === 13)
      return false;
  });

  $('textarea').on('input paste change', function(){
    autogrow(this);
  });

  setTimeout(function () {
    setDisplayMode();
  }, 10);
  console.log("Animation Initialization: Success");
}
