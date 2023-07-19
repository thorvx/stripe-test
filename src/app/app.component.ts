import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestService } from './rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  @ViewChild('cardInfo') cardInfo: ElementRef | undefined;
  _totalAmount: number;
  card: any;

  cardHandler = this.onChange.bind(this);
  cardError: string | undefined;

  cardData: any;
  paymentElements: any;
  @ViewChild('paymentElement') paymentElement: ElementRef | undefined;


  constructor(
    private cd: ChangeDetectorRef,
    private rest: RestService
  ) {
    this._totalAmount = 10;
  }

  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }

  ngAfterViewInit() {
    this.initiateCardElement();
    this.initConekta();
    this.initStripeForm();
  }

  initiateCardElement() {
    // Giving a base style here, but most of the style is in scss file
    const cardStyle = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.card = elements.create('card', { cardStyle, hidePostalCode: true });
    this.card.mount(this.cardInfo?.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  onChange(error: any) {
    console.log(error);
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = undefined;
    }
    this.cd.detectChanges();
  }

  async createStripeToken() {
    const { token, error } = await stripe.createToken(this.card);
    if (token) {
      this.onSuccess(token);
    } else {
      this.onError(error);
    }
  }

  onSuccess(token: any) {
    console.log(token);
    token.amount = this._totalAmount;
    this.rest.pay(token).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  onError(error: any) {
    console.log(error);
    if (error.message) {
      this.cardError = error.message;
    }
  }

  async saveCard() {
    const { token, error } = await stripe.createToken(this.card);
    if (token) {
      this.onSaveSuccess(token);
    } else {
      this.onError(error);
    }
  }

  onSaveSuccess(token: any) {
    console.log(token);
    this.rest.save(token).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  payAfter() {
    this.rest.payAfter('cus_OAM6pLX6JroBAD', 15).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }



  initConekta(){
    //privateKey: key_gVJKLtcqxmwHgE0bITfrktm
    const config = {
      publicKey: 'key_CX78yIRArkANlx3gGb51sGV',
      targetIFrame: 'example',
    };

    const callbacks = {
      onCreateTokenSucceeded: (token: any) => console.log('Exito: ', token),
      onCreateTokenError: (error: any) => console.log('Error: ', error),
      onGetInfoSuccess: (event: any) => console.log(event),
    };

    (<any>window).ConektaCheckoutComponents.Card({ config, callbacks });

    /* exito
    {
      "id": "tok_2u8JBqUigH8324zbW",
      "livemode": false,
      "used": false,
      "object": "token"
    } */
  }






    initStripeForm() {
      // Giving a base style here, but most of the style is in scss file
      const options = {
        clientSecret: 'pi_3NVd75HQcuvUR32s1vtWz40k_secret_0N8amSSiZ4RiDD41X684n9jeG',
        // Fully customizable with appearance API.
        appearance: {
          theme: 'flat'
        },
      };

      // Set up Stripe.js and Elements using the SetupIntent's client secret
      this.paymentElements = stripe.elements(options);

      // Create and mount the Payment Element
      this.cardData = this.paymentElements.create('payment');
      this.cardData.mount(this.paymentElement?.nativeElement);
    }


    saveCardStripe() {
      const self = this;
      stripe.confirmSetup({
        elements: this.paymentElements,
        redirect: 'if_required',
        //confirmParams: {
        //  return_url: 'https://example.com',
        //},
      })
      .then(function(result: any) {
        console.log(result);
        if (result.error) {
          self.cardError = result.error.message;
        }
      });

    }

    payStripe() {
      const self = this;
      stripe.confirmPayment({
        elements: this.paymentElements,
        redirect: 'if_required',
        confirmParams: {
          //return_url: 'https://example.com',
          receipt_email: 'diego.olguin@nuevatel.com',
        },
      })
      .then(function(result: any) {
        console.log(result);
        if (result.error) {
          self.cardError = result.error.message;
        }
      });

    }

    async createStripeVoucher() {

      const result = await stripe.confirmOxxoPayment(
        'pi_3NVfecFj1i1jApMN0ANjt9cI_secret_32a9WOEJ8AQLioYTC4Dyj0X5e',
        {
          payment_method: {
            billing_details: {
              name: "Diego Olguin",
              email: "diego.olguin@nuevatel.com",
            },
          },
        });

        console.log(result);

    }

}


