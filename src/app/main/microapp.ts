require('app/global/deps');
const bows = require('../../platform/helpers/bows-alt');
const logger = bows('MicroApp');
const template = require('./template.ract');
const emojisTpl = require('./partials/emojis.ract');
const customersTpl = require('./partials/customers.ract');
const githubTpl = require('./partials/github-events.ract');
import { IGitHubEvent,
         ICustomer,
         IEmoji } from 'app/interfaces';
import * as ractive from 'ractive';
import * as _ from 'lodash';
import { githubApi,
         northwindApi,
         imagesApi } from 'app/apis';

/**
 * Base class where Ractive lives
 */
class MicroApp {
    private ractive: ractive.Ractive; // the app reference
    constructor() {
        this.init();
    }
    public init() {
        this.initUI();
        this.initEvents();
    }
    private initUI() {
        this.ractive = new Ractive({
            el: '#micro-app',
            template: template,
            data: () => {
                return {
                    name: 'Ractive' ,
                    widgets: {},
                    brandLogo: imagesApi.getImage('trollface')
                };
            },
            partials: {
                selection: '<div>Welcome!</div>'
            }
        });
    }
    /**
     * Prepare event hooks (emojis, github events & nw-customers)
     */
    private initEvents() {
        this.ractive.on('get-events', (val) => {
         githubApi.getEvents().then((events: IGitHubEvent[]) => {
              this.ractive.resetPartial('selection', githubTpl);
              // use DataTable jQuery Plugin from https://datatables.net
              this.ractive.set('widgets.github', $('#github-events').DataTable({
                  'processing': true,
                  'data': events,
                  'columns': [
                      { 'data': 'actor.login' },
                      { 'data': 'actor.avatar_url' },
                      { 'data': 'repo.name' },
                      { 'data': 'repo.url' },
                      { 'data': 'created_at' }
                  ],
                  'columnDefs': [
                      {
                        'targets': 1,
                        'data': 'actor.avatar_url',
                        'render': function (data, type, full, meta) {
                            return `<img src="${data}" class="avatar">`;
                        }
                      },
                      {
                        'targets': 3,
                        'data': 'repo.url',
                        'render': function (data, type, full, meta) {
                            return `<a href="${data}" class="avatar">${data}</a>`;
                        }
                      }
                 ]
              }));
          });
        });
       this.ractive.on('get-customers', (val) => {
           northwindApi.getCustomers().then((customers: ICustomer[]) => {
               this.ractive.resetPartial('selection', customersTpl);
               this.ractive.set('widgets.customers', $('#customers').DataTable({
                   'processing': true,
                   'data': customers,
                   'columns': [
                       { 'data': 'CompanyName' },
                       { 'data': 'ContactName' },
                       { 'data': 'Address' },
                       { 'data': 'City' },
                   ]
               }));
           });
       });
       this.ractive.on('get-emojis', (val) => {
           githubApi.getEmojis().then((emojis: IEmoji[]) => {
               this.ractive.resetPartial('selection', emojisTpl);
               this.ractive.set('widgets.emojis', $('#emojis').DataTable({
                   'processing': true,
                   'data': emojis,
                   'serverSide': false,
                   'deferLoading': 50,
                   'columns': [
                       { 'data': 'name' },
                       { 'data': 'url' }
                   ],
                   'columnDefs': [
                        {
                            'targets': 1,
                            'render': function (data, type, row) {
                                return `<img src="${data}" class="emoji">`;
                            }
                        }
                    ]
               }));
           });
       });
       this.ractive.on('cleanup', (val) => {
           this.cleanup();
       });
    }
    /**
     * Remove unused widgets
     */
    private cleanup() {
        const widgets = this.ractive.get('widgets');
        if (_.isEmpty(widgets)) return;
        _.forOwn(widgets, (widget, name) => {
            if (widget.destroy) {
                (<DataTables.DataTable>widget).destroy(true);
            }
        });

        $('#content').empty();
    }
}
// Kick off the app
export default (function(){
    new MicroApp();
}());
