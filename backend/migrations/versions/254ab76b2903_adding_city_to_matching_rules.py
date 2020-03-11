"""Adding city to matching rules.

Revision ID: 254ab76b2903
Revises: 4d9808122745
Create Date: 2020-03-08 16:03:20.197617

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '254ab76b2903'
down_revision = '4d9808122745'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('flagged_employer_matching_rule', sa.Column('city', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('flagged_employer_matching_rule', 'city')
    # ### end Alembic commands ###