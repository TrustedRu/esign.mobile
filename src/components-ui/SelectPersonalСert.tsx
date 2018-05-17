import * as React from "react";
import { Container, Header, Item, Input, List, Content, Button, Icon, Text } from "native-base";
import { Image, AlertIOS } from "react-native";
import { Headers } from "../components/Headers";
import { ListCert } from "../components/ListCert";
import { styles } from "../styles";
import { addCert } from "../actions/index";
import { AddCertButton } from "../components/AddCertButton";

import { personalCertAdd } from "../actions/index";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

function mapStateToProps(state) {
   return {
      certificates: state.certificates.certificates
   };
}

function mapDispatchToProps(dispatch) {
   return {
      addCert: bindActionCreators(addCert, dispatch),
      personalCertAdd: bindActionCreators(personalCertAdd, dispatch)
   };
}

interface SelectPersonalСertProps {
   navigation: any;
   certificates: any;
   addCert(uri: string, fileName: string, password: string): Function;
   personalCertAdd?(title: string, img: string, note: string, issuerName: string, serialNumber: string, provider: string, category: string): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class SelectPersonalСert extends React.Component<SelectPersonalСertProps> {

   static navigationOptions = {
      header: null
   };

   ShowList(img) {
      return (
         this.props.certificates.map((cert, key) => ((cert.category.toUpperCase() === "MY") && (cert.hasPrivateKey)) ? <ListCert
            key={key}
            title={cert.subjectFriendlyName}
            note={cert.organizationName}
            img={img[key]}
            navigate={(page, cert1) => { this.props.navigation.navigate(page, { cert: cert1 }); }}
            goBack={() => { this.props.personalCertAdd(cert.subjectFriendlyName, img[key], cert.organizationName, cert.issuerName, cert.serialNumber, cert.provider, cert.category); this.props.navigation.goBack(); }}
            cert={cert}
            arrow /> : null));
   }

   render() {
      const { certificates, addCert } = this.props;
      const { navigate, goBack } = this.props.navigation;
      let img = [];
      let nowDate = new Date().getTime();
      for (let i = 0; i < certificates.length; i++) {
         nowDate < new Date(certificates[i].notAfter).getTime() ?
            img[i] = require("../../imgs/general/cert2_ok_icon.png") :
            img[i] = require("../../imgs/general/cert2_bad_icon.png");
      }
      return (
         <Container style={styles.container}>
            <Headers title="Выберите сертификат" goBack={() => goBack()} />
            <Content>
               {(certificates.filter((cert) => (cert.category.toUpperCase() === "MY") && (cert.hasPrivateKey))).length !== 0 ?
                  <List>{this.ShowList(img)}</List> :
                  <Text style={[styles.sign_enc_prompt, { paddingTop: "50%" }]}>Сертификатов нет. Нажмите кнопку 'добавить' для импорта или создания сертификата</Text>}
            </Content>
            <AddCertButton navigate={(page) => navigate(page)} addCertFunc={(uri, fileName, password) => this.props.addCert(uri, fileName, password)} />
         </Container>
      );
   }
}