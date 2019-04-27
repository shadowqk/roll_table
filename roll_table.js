class RollTable extends Application{

    static get defaultOptions(){
        const options = super.defaultOptions;
        options.template = "public/modules/roll_table/templates/roll_table.html";
        options.width = 100;
        options.top = 600;
        options.left = 850;
        return options;
    }
}

class ChatRoller{
    constructor(){
        this.hookReady();
    }
    hookReady(){
        Hooks.on('ready', () => {
            console.log("Chat Roller ready");

            let chat_d20 = $('#chat-controls').find('.fa-dice-d20');

            const template = './templates/roll_table.html';

            // hover animation, so you know you can click it
            $(chat_d20).mouseenter(() =>{
                chat_d20.addClass('spinning');
                setTimeout(() => chat_d20.removeClass('spinning'),2000);
            });

            let roll_table = new RollTable();

            $(chat_d20).click(async () =>{
                // we gotsta wait for it to render... dont know if there is a better way to do this????
                // but dont re-render if it is open
                if(!roll_table.element.length){
                    roll_table.render(true);
                    setTimeout(() => {
                        let pin_button = $('<a style="float:left;"><i class="pinnable fas fa-thumbtack"></i></a>');
                        let element = roll_table.element;
                        pin_button.insertBefore(element[0].firstElementChild.lastElementChild);
                    },50);
                }
            });

            // single click single roll
            // handle 
            $(document).on('click', '.chat-roller', (ev) => {
                // get die clicked
                let die = ev.target.getAttribute('data-die');
                // are there multiple?
                let die_mult = $(ev.target.firstElementChild).val() || 1
                let r = new Roll(`${die_mult}${die}`);
                r.roll();
                r.toMessage();
                // check if pinned
                if(!$(ev.target.parentNode.parentNode.parentNode).data('pinned')){
                    roll_table.close();
                }

                // get rid of that input if it was there
                if($(ev.target.firstElementChild).length){
                    $(ev.target.firstElementChild).remove();
                }
            });

            $(document).on('contextmenu', '.chat-roller', (ev) => {
                ev.preventDefault();
                let die = ev.target.getAttribute('data-die');
                let num_input = $("<input class='num_rolls' type='text' placeholder='#die'></input>");
                num_input.appendTo(ev.target);
                num_input.focus();
            });

            //pinning yo
            $(document).on('click', '.pinnable', (ev) => {
                if($(ev.target.parentNode).hasClass("pinned")){
                    $(ev.target.parentNode).removeClass("pinned");
                    $(ev.target.parentNode.parentNode.parentNode).data('pinned',false);
                }else{
                    $(ev.target.parentNode).addClass("pinned");
                    $(ev.target.parentNode.parentNode.parentNode).data('pinned',true);
                }
            });

        });
    }
}


let chat_roller = new ChatRoller();