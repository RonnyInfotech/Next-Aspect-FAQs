import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'NextAspectFaqsWebPartStrings';
import NextAspectFaqs from './components/NextAspectFaqs';
import { INextAspectFaqsProps } from './components/INextAspectFaqsProps';
import { getSP } from '../../services/pnpConfig';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "react-toastify/dist/ReactToastify.css";
import 'primeicons/primeicons.css';

// import css
require("../NextAspectFaqs/assets/css/style.css");
require("../../../node_modules/primereact/resources/primereact.min.css");
require("../NextAspectFaqs/assets/css/theme.css");
require("../NextAspectFaqs/assets/css/common.css");
require("../../../node_modules/primeflex/primeflex.css");

export interface INextAspectFaqsWebPartProps {
  description: string;
  context: any;
  absoluteUrl: string;
  tenantId: string;
  currentUserId: any;
}

export default class NextAspectFaqsWebPart extends BaseClientSideWebPart<INextAspectFaqsWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<INextAspectFaqsProps> = React.createElement(
      NextAspectFaqs,
      {
        context: this.properties.context,
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        userEmail: this.context.pageContext.user.loginName,
        absoluteUrl: this.context.pageContext.web.absoluteUrl,
        tenantId: this.context.pageContext.aadInfo.tenantId._guid,
        currentUserId: this.context.pageContext.legacyPageContext["userId"],
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public constructor() {
    super();
    // import third party css file from cdn
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css');
    SPComponentLoader.loadCss('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  }

  protected onInit(): Promise<void> {
    getSP(this.context);
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
