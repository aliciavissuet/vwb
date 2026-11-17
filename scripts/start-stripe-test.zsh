#!/bin/zsh
set -e

if [[ -z "$STRIPE_SECRET_KEY" ]]; then
  read -r -s "VWB_STRIPE_TEST_KEY?Paste your Stripe test secret key (hidden): "
  echo
  export STRIPE_SECRET_KEY="$VWB_STRIPE_TEST_KEY"
  unset VWB_STRIPE_TEST_KEY
fi

if [[ "$STRIPE_SECRET_KEY" != sk_test_* ]]; then
  echo "A Stripe test secret key beginning sk_test_ is required. Live keys are not accepted." >&2
  exit 1
fi

export VWB_ENABLE_TEST_CHECKOUT=1
exec npm run dev
