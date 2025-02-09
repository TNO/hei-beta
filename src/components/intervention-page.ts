import m from 'mithril';
import { FlatButton, Icon, ModalPanel, uuid4 } from 'mithril-materialized';
import { UIForm, LayoutForm, FormAttributes } from 'mithril-ui-form';
import { resolveImg } from '../assets/images';
import { Dashboards, defaultModel, Intervention, User } from '../models';
import { MeiosisComponent, routingSvc } from '../services';
import {
  availabilityOptions,
  evidenceDirOptions,
  evidenceLevelOptions,
  getOptionsLabel,
  hpeClassificationOptions,
  invasivenessOptions,
  joinListWithAnd,
  mainCapabilityOptions,
  maturityOptions,
  interventionCategoryOptions,
  interventionForm,
  resolveRefs,
  resolveChoice,
  optionsToTxt,
  specificCapabilityOptions,
  createInterventionFilter,
} from '../utils';

export const InterventionPage: MeiosisComponent = () => {
  let futureInterventionFilter: (
    intervention: Intervention,
    _index: number,
    _arr: Intervention[]
  ) => boolean;
  const initInterventionForm = (interventions: Intervention[], id: string, users: User[]) => {
    const added = new Set<string>();
    const interventionOptions = interventions
      .filter((t) => {
        if (added.has(t.intervention)) return false;
        added.add(t.intervention);
        return t.id !== id;
      })
      .map((t) => ({ id: t.id, label: t.intervention }));
    return interventionForm(users, interventionOptions);
  };

  const suggestSimilarInt = (intervention: Intervention, interventions: Intervention[]) => {
    const { mainCap, specificCap } = intervention;
    const sc = new Set<number>(specificCap instanceof Array ? specificCap : [specificCap]);
    return interventions
      .filter(
        (i) =>
          i.id !== intervention.id &&
          i.mainCap === mainCap &&
          i.specificCap &&
          (i.specificCap instanceof Array
            ? i.specificCap.some((s) => sc.has(s))
            : sc.has(i.specificCap))
      )
      .map((s) => s.id);
  };

  let id = '';
  let isEditing = false;
  let form1a: UIForm<Intervention> = [];
  let form1b: UIForm<Intervention> = [];
  let allInterventions = [] as Intervention[];
  let isBookmarked = false;

  return {
    oninit: ({
      attrs: {
        state: { model, curIntervention = {} as Intervention, showFutureInterventions },
        actions: { setPage, setIntervention },
      },
    }) => {
      const { interventions: technologies = [], users = [] } = model;
      futureInterventionFilter = createInterventionFilter(showFutureInterventions);
      setPage(Dashboards.INTERVENTION);
      id = m.route.param('id') || curIntervention.id || '';
      isEditing = (m.route.param('edit') as unknown as boolean) === true ? true : false;
      [form1a, form1b] = initInterventionForm(technologies, id, users);
      const found =
        id === curIntervention.id
          ? curIntervention
          : technologies.filter((t) => t.id === id).shift() || technologies[0];
      allInterventions = found
        ? technologies.filter((t) => t.intervention === found.intervention)
        : [];
      if (found !== curIntervention) setIntervention(found);
      window.scrollTo({ top: 0, left: 0 });
    },
    view: ({
      attrs: {
        state: {
          curIntervention = {} as Intervention,
          bookmarks,
          compareList = [],
          model = defaultModel,
          curUser,
        },
        actions: { saveModel, changePage, setIntervention, bookmark, compare },
      },
    }) => {
      id = m.route.param('id') || curIntervention.id || '';
      const { users, interventions: allTechnologies = [] } = model;
      const interventions = allTechnologies.filter(futureInterventionFilter);
      if (!curIntervention.id || curIntervention.id !== id) {
        [form1a, form1b] = initInterventionForm(interventions, id, users);
        const found = interventions.filter((t) => t.id === id).shift() || interventions[0];
        if (found) {
          allInterventions = interventions.filter((t) => t.intervention === found.intervention);
          setIntervention(found);
        }
        return;
      }
      isBookmarked = bookmarks.indexOf(curIntervention.id) >= 0;
      const selectedForComparison = compareList.indexOf(curIntervention.id) >= 0;
      const ownerId = curIntervention.owner;
      const updated = curIntervention.updated ? new Date(curIntervention.updated) : undefined;
      const owner = users.filter((u) => u.id === ownerId).shift();
      const usedLiterature = curIntervention.literature;

      const { md2html: md } = resolveRefs(curIntervention.literature);
      const mailtoLink =
        owner &&
        `mailto:${owner.email}?subject=${curIntervention.intervention.replace(/ /g, '%20')}`;
      const similarTech =
        curIntervention.similar &&
        curIntervention.similar.length > 0 &&
        interventions.filter((t) => curIntervention.similar.indexOf(t.id) >= 0);

      const filteredSpecCapOpt = specificCapabilityOptions.filter(
        (c) => c.mc === curIntervention.mainCap
      );

      const separatorClassName = curIntervention.future
        ? 'black-text future-intervention-color'
        : undefined;
      console.log(curIntervention);
      console.log(getOptionsLabel(interventionCategoryOptions, curIntervention.category));

      return [
        m(
          '.row.intervention-page',
          { style: 'height: 95vh' },
          curUser &&
            curUser === 'admin' && [
              m(FlatButton, {
                className: 'right no-print',
                label: isEditing ? 'Save' : 'Edit',
                // disabled: isEditing,
                iconName: isEditing ? 'save' : 'edit',
                onclick: () => {
                  // if (
                  //   !isEditing &&
                  //   (!curIntervention.similar || curIntervention.similar.length === 0)
                  // ) {
                  //   curIntervention.similar = suggestSimilarInt(
                  //     curIntervention,
                  //     interventions
                  //   );
                  // }
                  isEditing = !isEditing;
                },
              }),

              isEditing
                ? [
                    m(FlatButton, {
                      className: 'right',
                      label: 'Delete',
                      iconName: 'delete',
                      modalId: 'deleteIntervention',
                    }),
                  ]
                : m(FlatButton, {
                    className: 'right no-print',
                    label: 'Duplicate',
                    iconName: 'content_copy',
                    onclick: () => {
                      const clone = JSON.parse(JSON.stringify(curIntervention)) as Intervention;
                      clone.intervention += ' (COPY)';
                      clone.id = uuid4();
                      model.interventions.push(clone);
                      isEditing = true;
                      setIntervention(clone);
                      changePage(Dashboards.INTERVENTION, { id: clone.id });
                    },
                  }),
            ],
          isEditing
            ? m('.col.s12', [
                m(LayoutForm, {
                  form: form1a,
                  obj: curIntervention,
                  onchange: () => {
                    model.interventions = model.interventions.map((t) =>
                      t.id === curIntervention.id ? curIntervention : t
                    );
                    saveModel(model);
                  },
                } as FormAttributes),
                m(
                  '.row',
                  m(
                    '.col.s12.margin-top7',
                    m(FlatButton, {
                      className: 'right',
                      label: 'Suggest similar',
                      iconName: 'auto_awesome',
                      disabled: !(
                        curIntervention.mainCap &&
                        curIntervention.specificCap &&
                        (!(curIntervention.specificCap instanceof Array) ||
                          curIntervention.specificCap.length > 0)
                      ),
                      onclick: () => {
                        curIntervention.similar = suggestSimilarInt(curIntervention, interventions);
                      },
                    })
                  )
                ),
                m(LayoutForm, {
                  form: form1b,
                  obj: curIntervention,
                  onchange: () => {
                    model.interventions = model.interventions.map((t) =>
                      t.id === curIntervention.id ? curIntervention : t
                    );
                    saveModel(model);
                  },
                } as FormAttributes),
              ])
            : [
                m('h3', [
                  curIntervention.intervention,
                  m(
                    'a.btn-flat.btn-large.clean',
                    {
                      style: 'padding: 0 5px',
                      onclick: () => bookmark(curIntervention.id),
                    },
                    m(Icon, {
                      iconName: isBookmarked ? 'star' : 'star_border',
                      className: isBookmarked ? 'amber-text white' : 'white',
                    })
                  ),
                  !curIntervention.future &&
                    m(
                      'a.btn-flat.btn-large.clean',
                      {
                        style: 'padding: 0 5px',
                        onclick: () => compare(curIntervention.id),
                      },
                      m(Icon, {
                        iconName: 'balance',
                        className: selectedForComparison ? 'amber-text white' : 'white',
                      })
                    ),
                ]),
                curIntervention.desc && m('p.bold', md(curIntervention.desc)),
                m(
                  '.col.s12.m6',
                  m(
                    '.row.bottom-margin-15',
                    allInterventions.length === 1
                      ? m('h5.separator', { className: separatorClassName }, 'Description')
                      : m('h5.separator.button-row', { className: separatorClassName }, [
                          'Description',
                          ...allInterventions.map((t, i) =>
                            m(FlatButton, {
                              className:
                                t.id === curIntervention.id
                                  ? 'bold grey lighten-3'
                                  : 'grey lighten-3',
                              label:
                                getOptionsLabel(mainCapabilityOptions, t.mainCap, false) ||
                                `v${i + 1}`,
                              onclick: () => changePage(Dashboards.INTERVENTION, { id: t.id }),
                            })
                          ),
                        ]),
                    m('section', [
                      curIntervention.category &&
                        m('p', [
                          m('span.bold', 'Category: '),
                          getOptionsLabel(interventionCategoryOptions, curIntervention.category),
                        ]),
                      curIntervention.mainCap &&
                        m('p', [
                          m('span.bold', 'Main capability: '),
                          `${getOptionsLabel(
                            mainCapabilityOptions,
                            curIntervention.mainCap,
                            false
                          )} ${getOptionsLabel(
                            hpeClassificationOptions,
                            curIntervention.hpeClassification,
                            false
                          )}`,
                        ]),
                      curIntervention.specificCap &&
                        m('p', [
                          m('span.bold', 'Specific capability: '),
                          joinListWithAnd(
                            optionsToTxt(curIntervention.specificCap, filteredSpecCapOpt, false)
                          ) + '.',
                        ]),
                      curIntervention.invasive &&
                        m('p', [
                          m('span.bold', 'Invasive: '),
                          getOptionsLabel(invasivenessOptions, curIntervention.invasive) + '.',
                        ]),
                      curIntervention.maturity &&
                        m('p', [
                          m('span.bold', 'Maturity: '),
                          getOptionsLabel(maturityOptions, curIntervention.maturity) + '.',
                        ]),
                      typeof curIntervention.booster !== 'undefined' &&
                        m('p', [
                          m('span.bold', 'Can be used as booster: '),
                          `${
                            curIntervention.booster
                              ? 'Yes, the intervention can be applied quickly (approx. < 1 hour)'
                              : 'No, the intervention can not be applied quickly (approx. < 1 hour)'
                          }.`,
                        ]),
                    ])
                  )
                ),
                curIntervention.url &&
                  m(
                    '.col.s6.m6',
                    m('img.responsive-img', {
                      src: resolveImg(curIntervention.url, curIntervention.img),
                      alt: curIntervention.intervention,
                    })
                  ),
                similarTech &&
                  m(
                    '.col.s12',
                    m(
                      '.row.bottom-margin0',
                      m(
                        'p',
                        m(
                          'span.bold',
                          `Similar intervention${similarTech.length > 1 ? 's' : ''}: `
                        ),
                        similarTech.map((s, i) =>
                          m(
                            'a',
                            {
                              href: routingSvc.href(Dashboards.INTERVENTION, `?id=${s.id}`),
                              onclick: () => changePage(Dashboards.INTERVENTION, { id: s.id }),
                            },
                            s.intervention + (i < similarTech.length - 1 ? ', ' : '.')
                          )
                        )
                      )
                    )
                  ),
                m(
                  '.col.s12',
                  m('.row.bottom-margin0', [
                    m('h5.separator', { className: separatorClassName }, 'How it works'),
                    curIntervention.mechanism &&
                      m('p', [m('span.bold', 'Mechanism: '), md(curIntervention.mechanism)]),
                    curIntervention.future &&
                      curIntervention.sota &&
                      m('p', [m('span.bold', 'State of the art: '), md(curIntervention.sota)]),
                    curIntervention.examples &&
                      m('p', [m('span.bold', 'Examples: '), md(curIntervention.examples)]),
                    curIntervention.incubation &&
                      m('p', [m('span.bold', 'Incubation: '), md(curIntervention.incubation)]),
                    curIntervention.effectDuration &&
                      m('p', [
                        m('span.bold', 'Effect duration: '),
                        md(curIntervention.effectDuration),
                      ]),
                    curIntervention.future &&
                      curIntervention.implications &&
                      m(
                        'h5.separator',
                        { className: separatorClassName },
                        'Future possibilities & implications'
                      ),
                    m('p.white', md(curIntervention.implications)),
                    (curIntervention.practical ||
                      curIntervention.sideEffects ||
                      curIntervention.diff ||
                      curIntervention.ethical ||
                      curIntervention.evidenceDir ||
                      curIntervention.evidenceScore ||
                      curIntervention.availability ||
                      (curIntervention.future && curIntervention.challenges)) &&
                      m('h5.separator', { className: separatorClassName }, 'Keep in mind'),
                    curIntervention.practical &&
                      m('p', [
                        m(
                          'span.bold[title=This information is not medical advice, please read the disclaimer!]',
                          m.trust(
                            'Practical execution<sup class="red-text" style="font-size:1rem">*</sup>: '
                          )
                        ),
                        md(curIntervention.practical),
                      ]),
                    curIntervention.sideEffects &&
                      m('p', [
                        m('span.bold', 'Possible side-effects: '),
                        md(
                          resolveChoice(curIntervention.hasSideEffects, curIntervention.sideEffects)
                        ),
                      ]),
                    curIntervention.future &&
                      curIntervention.challenges &&
                      m('p', [m('span.bold', 'Challenges: '), md(curIntervention.challenges)]),
                    curIntervention.diff &&
                      m('p', [
                        m('span.bold', 'Individual differences: '),
                        md(resolveChoice(curIntervention.hasIndDiff, curIntervention.diff)),
                      ]),
                    curIntervention.ethical &&
                      m('p', [
                        m('span.bold', 'Ethical considerations: '),
                        md(resolveChoice(curIntervention.hasEthical, curIntervention.ethical)),
                      ]),
                    curIntervention.evidenceDir &&
                      m('p', [
                        m('span.bold', 'Evidence indication: '),
                        getOptionsLabel(evidenceDirOptions, curIntervention.evidenceDir) + '.',
                      ]),
                    curIntervention.evidenceScore &&
                      m('p', [
                        m('span.bold', 'Quality of evidence: '),
                        getOptionsLabel(evidenceLevelOptions, curIntervention.evidenceScore) + '.',
                      ]),
                    curIntervention.availability &&
                      m('p', [
                        m('span.bold', 'Availability: '),
                        getOptionsLabel(availabilityOptions, curIntervention.availability) + '.',
                      ]),
                    usedLiterature &&
                      usedLiterature.length > 0 &&
                      m('h5.separator', { className: separatorClassName }, 'References'),
                  ])
                ),
                m(
                  '.col.s12.m8',
                  m('.row', [
                    usedLiterature && [
                      m(
                        'ol.browser-default',
                        usedLiterature.map((l) =>
                          m(
                            'li',
                            m(
                              'a',
                              {
                                href: l.doi,
                                alt: l.title,
                                target: '_blank',
                              },
                              l.title
                            )
                          )
                        )
                      ),
                    ],
                  ])
                ),
                owner &&
                  m(
                    '.col.s12.m4',
                    m('p', [m('span.bold', 'Expert: '), owner.name]),
                    m('p', [m('span.bold', 'Email: '), m('a', { href: mailtoLink }, owner.email)]),
                    owner.phone &&
                      m('p', [
                        m('span.bold', 'Phone: '),
                        m('a', { href: `tel:${owner.phone}` }, owner.phone),
                      ]),
                    updated && m('p', [m('span.bold', 'Last update: '), updated.toDateString()])
                  ),
              ]
        ),
        m(ModalPanel, {
          id: 'deleteIntervention',
          title: `Delete ${curIntervention.intervention}?`,
          description: `Are you sure that you want to delete ${curIntervention.intervention}?`,
          buttons: [
            {
              label: 'Yes',
              iconName: 'delete',
              onclick: () => {
                model.interventions = model.interventions.filter(
                  (t) => t.id !== curIntervention.id
                );
                saveModel(model);
                changePage(Dashboards.INTERVENTIONS);
              },
            },
            { label: 'No', iconName: 'cancel' },
          ],
        }),
      ];
    },
  };
};
