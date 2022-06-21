//
// Code by Yunus Yıldız(Risky)
// ===========================================================================
//
// Note: If you put in onload, it not making the variable global. Instead, it becomes local.

var currentsize = getComputedStyle(document.documentElement).getPropertyValue('--big-button-size');
// Get root element and set margin of left side by button sizes
document.documentElement.style.setProperty("--align-relatives-fromsidenav", currentsize);
var timeouthalf, currentSelection, clickedElement, timeout_addnote, timeout_addnoteClearAnimation, i, notetemplate, lastnote = 1, lastContainerHeight = 0;
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
console.log("Note initalization: Success");
};

createnotetemplate();

window.onclick=function(e){
  clickedElement = e;
}

window.onload=function(){

  $("#cl_menu").click(function(e){
    // Basit bir taktikle c++ projelerimden ogrendigim bir toggle taktigini uyguladım. Ancak else yerine else if kullanılmalı ki targetin bu bizim menu oldugunu kanıtlayalım.
    if($(this).attr("is-expanded") == "false")
    {
      $('#cl_sidenav').addClass("sidenav-expanded");
      $(this).attr("is-expanded", "true");
      // Root elementini alıyoruz. Documentelement bu yuzden kullandık.
      document.documentElement.style.setProperty("--align-relatives-fromsidenav", (getComputedStyle(document.documentElement).getPropertyValue("--sidebar-expanded-big")));
    }
    else if($(this).has(e.target))
    {
      $('#cl_sidenav').removeClass("sidenav-expanded");
      $(this).attr("is-expanded", "false");
      document.documentElement.style.setProperty("--align-relatives-fromsidenav", (getComputedStyle(document.documentElement).getPropertyValue("--big-button-size")));
    }
  });

  $('#cl_sidenav').hover(function(){
    // animasyon icin timeout testleri
    //clearTimeout(timeouthalf);
    currentSelection = $(this).find(".cl_button");
    // timeouthalf = setTimeout(function(e) {
    //   $('#cl_sidenav').addClass("sidenav-expanded");
    //   currentSelection.addClass("sidenav-expandinside");
    // }, 200);
    $('#cl_sidenav').addClass("sidenav-expanded");
    currentSelection.addClass("sidenav-expandinside");
  },
  function(){
    if($("#cl_menu").attr("is-expanded") != "true"){
      //clearTimeout(timeouthalf);
      $('#cl_sidenav').removeClass("sidenav-expanded");
      currentSelection.removeClass("sidenav-expandinside");
    }
  });

// Addnote area Animations!
  $('#cl_addnote-titletext').focus(function(){
    clearTimeout(timeout_addnote);
    $('#cl_addnote-message').css("opacity", 1);
    $('#cl_addnotearea').height("125px");
    timeout_addnoteClearAnimation = setTimeout(function(){
      $('#cl_addnotearea').removeAttr("style");
    }, 500);
    $('#cl_addnote-message').removeClass("hide");
  })
  .focusout(function()
  {
    setTimeout(function() {
      if(!(clickedElement.target.id == 'cl_addnote-messagetext') && (checkifEmpty('#cl_addnote-messagetext') && checkifEmpty('#cl_addnote-titletext')))
      {
        $('#cl_addnote-message').css("opacity", 0);
        clearTimeout(timeout_addnoteClearAnimation);
        $('#cl_addnotearea').height("125px");
        $('#cl_addnotearea').height("40px");
        timeout_addnote = setTimeout(function() {
            $('#cl_addnote-message').addClass("hide");
            console.log("WORKS");
        }, 500);
      }
    }, 100);
  });



  $('#cl_addnote-messagetext').focusout(function()
  {
    setTimeout(function() {
      if(!(clickedElement.target.id == 'cl_addnote-titletext') && (checkifEmpty('#cl_addnote-messagetext') && checkifEmpty('#cl_addnote-titletext')))
      {
        console.log($('#cl_addnote-messagetext').val(), $('#cl_addnote-titletext').val());

        $('#cl_addnote-message').css("opacity", 0);
        $('#cl_addnotearea').height("125px");
        $('#cl_addnotearea').height("40px");
        timeout_addnote = setTimeout(function() {
            $('#cl_addnote-message').addClass("hide");
            console.log("WORKS");
        }, 500);
      }
    }, 100);
  });

  // Add note! The most important part is here-------------------------------------------------------- coded by Yunus YILDIZ
  $('#cl_addnote-button').click(function(){
    var noteattritubes = [$('#cl_addnote-titletext').val(), $('#cl_addnote-messagetext').val(), notetemplate, ""];
    noteattritubes[2] = $(notetemplate).clone();
    $(noteattritubes[2]).find('.cl_note-title').find('textarea').val(noteattritubes[0]);
    $(noteattritubes[2]).find('.cl_note-message').find('textarea').val(noteattritubes[1]);
    $(noteattritubes[2]).attr('id', "cl_note-" + lastnote);
    $(noteattritubes[2]).appendTo($('#cl_shownotesarea'));
    // Lastnote was set to 1 so we need to make that empty fr!!!!!!!!!
    noteattritubes[3] = $('#cl_note-' + lastnote);
    noteattritubes[3] = document.getElementById('cl_note-' + lastnote);
    // Set note height and make them animateable!
    addDummy(noteattritubes[3], defaultDuration);
    lastnote++;
  });

  function checkifEmpty(elem)
  {
    if(!($(elem).val()))
    {
      return 1;
    }
    return 0;
  }




  // ANIMATION CODES https://codepen.io/hideya/pen/Jamabx Changed in this project by - Yunus Yıldız
  var targetClassName = 'flex-wrap-anim';
  var defaultDuration = '0.3s';
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
      console.log('Created Dummy of: ', item);

      var dummyDiv = document.createElement('div');
      dummyDiv.classList.add(targetClassName + '-dummy');
      var rect = item.getBoundingClientRect();
      dummyDiv.style.width = rect.width + 'px';
      dummyDiv.style.height = rect.height + 'px';
      dummyDiv.style.visibility = 'hidden';
      dummyDiv['__' + targetClassName + '_pair'] = item;
      dummyDiv['__' + targetClassName + '_duration'] = duration;
      item.parentNode.appendChild(dummyDiv);
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

  window.addEventListener('resize', function(event) {
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
  });

  // Initialize no enter in components like text inputs
  $('.noEnter').keydown(function(e) {
  if(e.which === 13)
      return false;
  });

  $('textarea').on('input paste', function(e){
    console.log("INPUTE");
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  // Initialize height by content
  function initializeHeightByContent(){
    setTimeout(
      function(){
        console.log("Initialized Height By Content: Success");
        i = 0;
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
          i++;
        });
      }, 0);
  }

  //initializeHeightByContent();
  console.log("Animation Initialization: Success");
}





// UNOPTIMIZED bunlar jquery olmadan yapılanı ancak zor geldigi icin jquery kullanmaya karar verdim.
// window.addEventListener('click', function(e){
//   if (!document.getElementById('cl_sidenav').contains(e.target) && !(document.getElementById('cl_menu').getAttribute("is-expanded") == "false")){
//     console.log("if WORKED");
//     document.getElementById('cl_menu').setAttribute("is-expanded", "false");
//     $("#cl_sidenav").removeClass("sidenav-expanded");
//   }

//   else if(!document.getElementById('cl_menu').contains(e.target) && !document.getElementById('cl_sidenav').contains(e.target)){
//     console.log("ELSE IF WORKED");
//     $("#cl_sidenav").removeClass("sidenav-expanded");
//   }

//   else if(document.getElementById('cl_sidenav').contains(e.target))
//   {
//     console.log("A");
//   }

//   else{
//     console.log("ELSE WORKED");
//     document.getElementById('cl_menu').setAttribute("is-expanded", "true");
//     $("#cl_sidenav").addClass("sidenav-expanded");
//   }
// });
