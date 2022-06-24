//
// Code by Yunus Yıldız(Risky)
// ===========================================================================
//
// Note: If you put in onload, it not making the variable global. Instead, it becomes local.

// var currentsize = getComputedStyle(document.documentElement).getPropertyValue('--big-button-size');
// Get root element and set margin of left side by button sizes
// document.documentElement.style.setProperty("--align-relatives-fromsidenav", currentsize);
var timeouthalf, currentSelection, clickedElement, timeout_addnote, timeout_addnoteClearAnimation, timeout_resizeBoxAnimation, timeout_resizeTextInitialization, i, notetemplate, lastnote = 1, lastContainerHeight = 0;
var createnotetemplate = function(){
notetemplate = $('<div>', {
    class: 'cl_note'
});
$('<div>', {
    class: 'cl_note-title'
}).appendTo(notetemplate);

$('<textarea>', {
    class: 'input_text cl_textarea noEnter',
    placeholder: 'Title',
    maxlength: '75',
    style: 'font-size:large; margin:0; padding-right:20px;'
}).appendTo($(notetemplate).find('.cl_note-title'));

$('<div>', {
    class: 'cl_note-message'
}).appendTo(notetemplate);

$('<textarea>', {
    class: 'input_text cl_textarea',
    placeholder: 'Message',
    maxlength: '300',
    style: 'font-size:large; margin:0; padding-right:20px;'
}).appendTo($(notetemplate).find('.cl_note-message'));
console.log("Note Initalization: Success");
};

createnotetemplate();

window.onclick=function(e){
  clickedElement = e;
}

window.onload=function(){
  setDisplayMode();
  $("#cl_menu").click(function(e){
    // Basit bir taktikle c++ projelerimden ogrendigim bir toggle taktigini uyguladım. Ancak else yerine else if kullanılmalı ki targetin bu bizim menu oldugunu kanıtlayalım.
    if($(this).attr("is-expanded") == "false")
    {
      // For mobile
      if(['extrasmall', 'small', 'medium'].indexOf(getRootAttr("--device-model")) >= 0) $("#cl_sidenav").focus();

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
    if($('#cl_menu').attr("is-expanded") == "true" && ['extrasmall', 'small', 'medium'].indexOf(getRootAttr("--device-model")) >= 0)
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
    var noteitem = $(elem).closest('.cl_note'), dummyitem = dummyList.find((e) => { return e['__flex-wrap-anim_id'] === 'dummy-' + noteitem.attr('id') });
    if(noteitem.length > 0 && ((noteitem.outerHeight() + notegap) + 'px') != dummyitem.style.height)
    {
      dummyitem.style.height = (noteitem.outerHeight() + notegap) + 'px';
      reorderNotes();
      // console.log("last heights(dummy, textarea): ", ((currentSelection.outerHeight() + notegap) + 'px'), dummyList.find((e) => { return e['__flex-wrap-anim_id'] === 'dummy-cl_note-0' }).style.height);
    }
    elem.style.height = 'auto';
    elem.style.height = (elem.scrollHeight) + 'px';
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

      dummyDiv['__' + targetClassName + '_height'] = dummyDiv.style.height;
      dummyDiv['__' + targetClassName + '_id'] = 'dummy-' + item.id;
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
      reorderNotes();
      $('textarea').each(function() {
        if($(this).val().length > 0)
        {
          this.style.height = 'auto';
          this.style.height = (this.scrollHeight) + 'px';
        }
      });
      console.log("Texts resized as window size!");
    }, 150);
    reorderNotes();
  });

  function setDisplayMode(){
    var windowsize = $(window).width();
    (windowsize <= 600) ? setRootAttr('--device-model', 'extrasmall') :
    (windowsize <= 768) ? setRootAttr('--device-model', 'small') :
    (windowsize <= 992) ? setRootAttr('--device-model', 'medium') :
    (windowsize <= 1200) ? setRootAttr('--device-model', 'large') : setRootAttr('--device-model', 'desktop');

    switch(getRootAttr("--device-model"))
    {
      // Will set note sizes on small devices. Like 100 or 50px is enough. LETS GO
      case 'extrasmall':
        setRootAttr("--align-relatives-fromsidenav", '0');
      break;

      case 'small':
        setRootAttr("--align-relatives-fromsidenav", '0');
      break;

      case 'medium':
        setRootAttr("--align-relatives-fromsidenav", getRootAttr("--big-button-size"));
      break;

      case 'large':
        setRootAttr("--align-relatives-fromsidenav", getRootAttr("--big-button-size"));
      break;

      case 'desktop':
        setRootAttr("--align-relatives-fromsidenav", getRootAttr("--big-button-size"));
      break;
    }
  }

  // Initialize no enter in components like text inputs
  $('.noEnter').keydown(function(e) {
  if(e.which === 13)
      return false;
  });

  $('textarea').on('input paste change', function(){
    autogrow(this);
  });


  console.log("Animation Initialization: Success");
}
