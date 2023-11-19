var altHeld = false;
var ctrlHeld = false;
var shiftHeld = false;
var toggleSnap = false;
var cursor_x = -1;
var cursor_y = -1;

function unhide_interface() {
    if ($('#hide_interface_button').hasClass('unhidden')) {
        $('#hide_interface_button').hide().removeClass('unhidden');
        $('.hideable').show();
        $(".dice-toolbar").show();
    } else {
        if ($('#hide_rightpanel').hasClass('point-right')) {
            $('#hide_rightpanel').click();
        }
        if (is_characters_page()) {
            hide_player_sheet();
        }
        $(".dice-toolbar").hide();
        $('#hide_interface_button').show().addClass('unhidden');
        $('.hideable').hide();
    }
}

function init_keypress_handler(){


Mousetrap.bind('c', function () {       //combat tracker
        $('#combat_button').click()
});


Mousetrap.bind('d', function () {       //draw menu
    if (window.DM){
        $('#draw_button').click()
    }
});

Mousetrap.bind('t', function () {       //draw menu
    if (window.DM){
        $('#text_button').click()
    }
});

Mousetrap.bind('a', function () {       //aoe menu
    $('#aoe_button').click()
    return false;
});

Mousetrap.bind('f', function () {       //fog menu
    if (window.DM){
        $('#fog_button').click()
    }
});


Mousetrap.bind('n', function () {   //while combat menu is open, press n to cycle next in initiative order
    if(window.DM && $('#combat_tracker_inside').attr('style') == 'display: block;') {
        $('#combat_next_button').click()
    }
});

Mousetrap.bind('r', function () {       //ruler
    $('#ruler_button').click()
});


Mousetrap.bind('s', function () {       //video fullscreen toggle
    $('#select-button').click()
});


Mousetrap.bind('v', function () {       //video fullscreen toggle 
    if(shiftHeld)
        return;

    $('#jitsi_switch').click()
});

Mousetrap.bind('shift+v', function () {       //check token vision
   window.SelectedTokenVision = true;
   redraw_light();
});

Mousetrap.bind('=', function () {       //zoom plus
    $('#zoom_plus').click()
});

Mousetrap.bind('+', function () {       //zoom plus
    $('#zoom_plus').click()
});

Mousetrap.bind('-', function () {       //zoom minus
    $('#zoom_minus').click()
});

Mousetrap.bind('0', function () {   
    $('#zoom_fit').click()
});

Mousetrap.bind('space', function (e) {     //collapse/show character sheet
	e.preventDefault();
    if(!window.DM) {
        $('#sheet_button').click()
    }
    else{
        $('#pause_players').click()
    }
});


Mousetrap.bind('q', function () {       //collapse/show sidebar. (q is next to tab, also used to show/hide elements)
    $('#hide_rightpanel').click()
});

Mousetrap.bind('w', function () {
    if(shiftHeld)
        return;
    $('#wall_button').click()   
});
Mousetrap.bind('shift+w', function () {
    if(window.DM){
        $('#show_walls').toggleClass(['button-enabled', 'ddbc-tab-options__header-heading--is-active']);
        redraw_light_walls();
    }
       
});
Mousetrap.bind('l', function () {
    if(shiftHeld)
        return;
    $('#vision_button').click()
});
Mousetrap.bind('shift+l', function () {
     if(window.DM){
        $('#select_locked').click();
    }
});

Mousetrap.bind('esc', function () {     //deselect all buttons
    stop_drawing();

    if(!$("#wall_button").hasClass("button-enabled")){
        $('#select-button').click();
    }
    else{
        redraw_light_walls();
    }

    close_token_context_menu();
    $(".draggable-token-creation").addClass("drag-cancelled");
    $(".draggable-sidebar-item-reorder").addClass("drag-cancelled");
    try {
        $( '.ui-draggable-dragging' ).draggable("option", { revert: true }).trigger( 'mouseup' ).draggable("option", {revert: false })
    } catch (whoCares) { }
    let elementPreventingSidebarClose = $(".prevent-sidebar-modal-close");
    if (elementPreventingSidebarClose.length > 0) {
        if (elementPreventingSidebarClose.hasClass("sidebar-flyout") || elementPreventingSidebarClose.closest(".sidebar-flyout").length > 0) {
            // it's a flyout... close it
            elementPreventingSidebarClose.remove();
        }
        // any others that we want to close on esc?
    } else {
        // only close the sidebar if there isn't something on the screen explicitly trying to keep it open
        close_sidebar_modal();
    }
    remove_tooltip();
    removeError();
});

//menu specific shortcuts, select the nth element of menu when it's open
function handle_menu_number_press(e) {
    const visibleMenuId = `#${$('[id*="_menu"].visible').attr("id")}`
    const button = $(`${visibleMenuId} .menu-option:eq(${parseInt(e.key) -1})`)
    $(button).click()
    $(button).children().first().focus()
}
Mousetrap.bind(["1","2","3","4","5","6","7","8","9"], function (e) {
    handle_menu_number_press(e)
});

Mousetrap.bind('up', async function (e) {
    const visibleMenuId = `#${$('[id*="_menu"].visible').attr("id")}`
    if (visibleMenuId){
        // prevent scrolling the window
        e.preventDefault();
        $(`${visibleMenuId} .ddbc-tab-options__header-heading--is-active`).first().parent().prevAll().not("[data-skip='true']").first().children().first().click()
    }

    if ($("#select-button").hasClass("button-enabled") || !window.DM) {
        for (let i = 0; i < window.CURRENTLY_SELECTED_TOKENS.length; i++) {
            let id = window.CURRENTLY_SELECTED_TOKENS[i];
            let token = window.TOKEN_OBJECTS[id];
            await token.moveUp();
        }
        return false;
    }
});

Mousetrap.bind('down', async function (e) {
    const visibleMenuId = `#${$('[id*="_menu"].visible').attr("id")}`
    if (visibleMenuId){
        // prevent scrolling the window
        e.preventDefault();
        $(`${visibleMenuId} .ddbc-tab-options__header-heading--is-active`).first().parent().nextAll().not("[data-skip='true']").first().children().first().click()

    }

    if ($("#select-button").hasClass("button-enabled") || !window.DM) {
        for (let i = 0; i < window.CURRENTLY_SELECTED_TOKENS.length; i++) {
            let id = window.CURRENTLY_SELECTED_TOKENS[i];
            let token = window.TOKEN_OBJECTS[id];
            await token.moveDown();
        }
        return false;
    }
});


Mousetrap.bind('left', async function (e) {
    if ($("#select-button").hasClass("button-enabled") || !window.DM) {
        e.preventDefault();
        for (let i = 0; i < window.CURRENTLY_SELECTED_TOKENS.length; i++) {
            let id = window.CURRENTLY_SELECTED_TOKENS[i];
            let token = window.TOKEN_OBJECTS[id];
            await token.moveLeft();
        }
        return false;
    }
});

Mousetrap.bind('right', async function (e) {
    if ($("#select-button").hasClass("button-enabled") || !window.DM) {
        e.preventDefault();
        for (let i = 0; i < window.CURRENTLY_SELECTED_TOKENS.length; i++) {
            let id = window.CURRENTLY_SELECTED_TOKENS[i];
            let token = window.TOKEN_OBJECTS[id];
            await token.moveRight();
        }
        return false;
    }
});

Mousetrap.bind('alt', function () {
    if (altHeld) {
        return false;
    } else {
        altHeld = true;
    }
    window.selectedMenuButton = $('#VTTWRAPPER ~ .ddbc-tab-options--layout-pill>button.button-enabled')
    if (!($('#ruler_button').hasClass('button-enabled'))) {
        $('#ruler_button').click()
    }

    $(window).off('blur.altCheck').one('blur.altCheck', function(){
      window.altHeld = false;
        if ($('#ruler_button').hasClass('button-enabled')) {
            window.selectedMenuButton.click()
        }
    })
    return false
}, 'keydown');

Mousetrap.bind('alt', function () {
    if ($('#ruler_button').hasClass('button-enabled')) {
        window.selectedMenuButton.click()
    }
    altHeld = false;
    return false
}, 'keyup');



Mousetrap.bind('shift', function () {
    if (shiftHeld == true) {
        return;
    } else {
        shiftHeld = true;
    }
    $(window).off('blur.shiftCheck').one('blur.shiftCheck', function(){
      window.shiftHeld = false;
    })
}, 'keydown');

Mousetrap.bind('shift', function () {
    shiftHeld = false;
}, 'keyup');


Mousetrap.bind('ctrl', function () {
	ctrlHeld=true;
	window.toggleSnap=true;
}, 'keydown');

Mousetrap.bind('ctrl', function () {
	ctrlHeld=false;
	window.toggleSnap=false;
}, 'keyup');

Mousetrap.bind('shift+h', function () {
    unhide_interface();
});

Mousetrap.bind('ctrl+c', function(e) {
    if (window.navigator.userAgent.indexOf("Mac") != -1) return; // Mac/iOS use command
    copy_selected_tokens();
});
Mousetrap.bind('command+c', function(e) {
    copy_selected_tokens();
});

Mousetrap.bind('ctrl+v', function(e) {
    if (window.navigator.userAgent.indexOf("Mac") != -1) return; // Mac/iOS use command
    if($('#temp_overlay:hover').length>0){
        paste_selected_tokens(window.cursor_x, window.cursor_y);
    } 
    else {
        let center = center_of_view();
        paste_selected_tokens(center.x, center.y);
    }
});
Mousetrap.bind('command+v', function(e) {
    if($('#temp_overlay:hover').length>0){
        paste_selected_tokens(window.cursor_x, window.cursor_y);
    } 
    else {
        let center = center_of_view();
        paste_selected_tokens(center.x, center.y);
    }
});

document.onmousemove = function(event)
{
 window.cursor_x = event.pageX;
 window.cursor_y = event.pageY;
}

Mousetrap.bind(['backspace', 'del'], function(e) {
    delete_selected_tokens();
});
Mousetrap.bind('ctrl+z', function(e) {
    handle_undo();
});
Mousetrap.bind('command+z', function(e) {
    handle_undo();
});
Mousetrap.bind(']', function(e) {
    select_next_tab();
});
Mousetrap.bind('[', function(e) {
    select_prev_tab();
});

function handle_undo(){
    const buttonSelectedClasses = "button-enabled ddbc-tab-options__header-heading--is-active"
    if ($("#select-button").hasClass(buttonSelectedClasses)){
        undo_delete_tokens();
    }
    else if(($("#fog_button").hasClass(buttonSelectedClasses))){
        $("#fog_undo").click()
    }
    else if(($("#draw_button").hasClass(buttonSelectedClasses) || $("#vision_button").hasClass(buttonSelectedClasses))){
        $("#draw_undo").click()
    }
    else if(($("#text_button").hasClass(buttonSelectedClasses))){
        $("#text_undo").click()
    }

}

var rotationKeyPresses = [];
window.addEventListener("keydown", async (event) => {
    const arrowKeys = [ 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown' ];
    if (event.shiftKey && arrowKeys.includes(event.key) ) {
        rotationKeyPresses.push(event.key)
    }
    if((event.ctrlKey || event.metaKey) && event.key == 'a' && event.target.tagName == 'INPUT'){
        event.target.select();
    }
});
window.addEventListener("keyup", async (event) => {
    if (!event.shiftKey) {
        rotationKeyPresses = [];
        return;
    }
    if (rotationKeyPresses.includes('ArrowDown') && rotationKeyPresses.includes('ArrowLeft')) {
        rotate_selected_tokens(45, true);
    } else if (rotationKeyPresses.includes('ArrowLeft') && rotationKeyPresses.includes('ArrowUp')) {
        rotate_selected_tokens(135, true);
    } else if (rotationKeyPresses.includes('ArrowUp') && rotationKeyPresses.includes('ArrowRight')) {
        rotate_selected_tokens(225, true);
    } else if (rotationKeyPresses.includes('ArrowRight') && rotationKeyPresses.includes('ArrowDown')) {
        rotate_selected_tokens(315, true);
    } else if (rotationKeyPresses.includes('ArrowDown')) {
        rotate_selected_tokens(0, true);
    } else if (rotationKeyPresses.includes('ArrowLeft')) {
        rotate_selected_tokens(90, true);
    } else if (rotationKeyPresses.includes('ArrowUp')) {
        rotate_selected_tokens(180, true);
    } else if (rotationKeyPresses.includes('ArrowRight')) {
        rotate_selected_tokens(270, true);
    }

    rotationKeyPresses = [];
});

}